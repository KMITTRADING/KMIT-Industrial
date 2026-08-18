import * as THREE from 'three';

/**
 * One WebGL context for the whole page.
 *
 * Why this exists (B1): the previous build created a separate renderer, and
 * therefore a separate WebGL context, for every scene on the page — hero,
 * sectors, journey, explorer. Browsers cap live contexts at around 16 and then
 * silently drop the oldest, which is what killed the tab during fast scrolling.
 * Four contexts on one page also means four copies of the GL state machine and
 * four render loops competing for the main thread.
 *
 * The fix is the standard "one renderer, many views" pattern: a single fixed
 * canvas behind the page content, and a scissor rectangle per view. Each section
 * registers the DOM element it wants to draw into, plus its own scene and
 * camera. On each frame the host walks the registered views, and for every one
 * currently on screen it sets the viewport and scissor to that element's rect
 * and renders. Layout stays entirely in CSS; the GL side just follows it.
 *
 * Rendering is on demand (B2). A frame is drawn only when something actually
 * changed: a view reported new scroll progress, a view is animating, or the
 * layout resized. A parked, static scene costs zero frames.
 */

export type SceneView = {
  /** The element whose box this view draws into. */
  element: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  /**
   * Called before the view is drawn. Return true if the view still needs
   * frames (an animation is running); false if it has settled.
   */
  update?: (dt: number, elapsed: number) => boolean;
  /** Called when the view's pixel size changes. */
  resize?: (width: number, height: number) => void;
  /** Release this view's own GPU resources. The renderer is not ours to free. */
  dispose?: () => void;
};

type Registered = SceneView & {
  visible: boolean;
  /** Set while this view still wants frames. */
  active: boolean;
};

let host: Host | null = null;

class Host {
  readonly canvas: HTMLCanvasElement;
  readonly renderer: THREE.WebGLRenderer;
  private views = new Set<Registered>();
  private io: IntersectionObserver;
  private ro: ResizeObserver;
  private raf = 0;
  private last = 0;
  private start = performance.now();
  private needsFrame = true;
  private running = false;
  private pixelRatio = 1;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'scene-host';
    this.canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.canvas);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      // B4: MSAA off. The scenes are lit solids on a flat ground, and a slightly
      // higher pixel ratio buys more perceived sharpness than MSAA does here.
      antialias: false,
      powerPreference: 'high-performance',
      // The default would keep the drawing buffer around for readback nobody does.
      preserveDrawingBuffer: false,
      stencil: false,
    });
    this.renderer.setClearAlpha(0);
    this.renderer.setScissorTest(true);
    /* Each view clears and draws inside its own scissor box, so the whole canvas
       has to be wiped first — otherwise a view that scrolls away leaves its last
       frame painted on the shared surface forever. */
    this.renderer.autoClear = false;
    // B4: filmic tone mapping and correct output space, or PBR reads flat.
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    // B4: dynamic shadow maps are off entirely; contact shadows are baked.
    this.renderer.shadowMap.enabled = false;

    this.io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          for (const view of this.views) {
            if (view.element !== entry.target) continue;
            view.visible = entry.isIntersecting;
            if (entry.isIntersecting) this.invalidate();
          }
        }
        this.syncLoop();
      },
      { rootMargin: '10% 0px' }
    );

    this.ro = new ResizeObserver(() => this.invalidate());
    this.ro.observe(document.documentElement);

    window.addEventListener('resize', this.onResize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);

    this.layout();
  }

  private onResize = () => {
    this.layout();
    this.invalidate();
  };

  private onVisibility = () => {
    // B2: a hidden tab draws nothing at all.
    if (document.hidden) this.stop();
    else this.syncLoop();
  };

  private layout() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // B4: pixel ratio capped at 1.5.
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(w, h, false);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    for (const view of this.views) {
      const rect = view.element.getBoundingClientRect();
      view.resize?.(rect.width, rect.height);
    }
  }

  register(view: SceneView): () => void {
    const entry: Registered = { ...view, visible: false, active: true };
    this.views.add(entry);
    this.io.observe(view.element);

    const rect = view.element.getBoundingClientRect();
    view.resize?.(rect.width, rect.height);
    entry.visible = rect.bottom > 0 && rect.top < window.innerHeight;

    this.invalidate();
    this.syncLoop();

    return () => {
      this.io.unobserve(view.element);
      this.views.delete(entry);
      // Only this view's own geometry, materials and textures. The renderer is
      // shared and outlives it.
      entry.dispose?.();
      if (this.views.size === 0) destroyHost();
      else this.syncLoop();
    };
  }

  /** Ask for one more frame — scroll moved, a value changed, layout shifted. */
  invalidate() {
    this.needsFrame = true;
    this.syncLoop();
  }

  /** Mark a view as animating (or settled), so the loop knows to keep going. */
  setActive(element: HTMLElement, active: boolean) {
    for (const view of this.views) {
      if (view.element === element) view.active = active;
    }
    if (active) this.invalidate();
  }

  private wantsFrames() {
    if (document.hidden) return false;
    if (this.needsFrame) return true;
    for (const view of this.views) {
      if (view.visible && view.active) return true;
    }
    return false;
  }

  private syncLoop() {
    if (this.wantsFrames()) this.startLoop();
    else this.stop();
  }

  private startLoop() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private frame = (now: number) => {
    const dt = Math.min((now - this.last) / 1000, 1 / 20);
    this.last = now;
    this.needsFrame = false;

    const elapsed = (now - this.start) / 1000;
    const height = window.innerHeight;
    let anyActive = false;

    // One full-surface wipe, outside any scissor box, before the views draw.
    this.renderer.setScissorTest(false);
    this.renderer.clear(true, true, false);
    this.renderer.setScissorTest(true);

    // The canvas is fixed to the viewport, so a view's scissor box is simply its
    // element's rect in viewport coordinates, with y flipped for GL.
    for (const view of this.views) {
      if (!view.visible) continue;
      const rect = view.element.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= height) continue;
      if (rect.width < 1 || rect.height < 1) continue;

      const stillAnimating = view.update?.(dt, elapsed) ?? false;
      if (stillAnimating) anyActive = true;

      const x = Math.floor(rect.left);
      const y = Math.floor(height - rect.bottom);
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);

      this.renderer.setViewport(x, y, w, h);
      this.renderer.setScissor(x, y, w, h);

      const camera = view.camera;
      if (camera instanceof THREE.PerspectiveCamera) {
        const aspect = w / h;
        if (Math.abs(camera.aspect - aspect) > 0.001) {
          camera.aspect = aspect;
          camera.updateProjectionMatrix();
        }
      }
      this.renderer.render(view.scene, camera);
    }

    if (anyActive || this.needsFrame) {
      this.raf = requestAnimationFrame(this.frame);
    } else {
      this.running = false;
      this.raf = 0;
    }
  };

  destroy() {
    this.stop();
    this.io.disconnect();
    this.ro.disconnect();
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibility);
    for (const view of this.views) view.dispose?.();
    this.views.clear();
    this.renderer.dispose();
    // Hand the context back immediately rather than waiting for GC — this is
    // what stops contexts accumulating across client-side navigations.
    this.renderer.forceContextLoss();
    this.canvas.remove();
  }
}

/** Creates the host on first use. Exactly one exists per document. */
export function getSceneHost(): Host {
  if (!host) host = new Host();
  return host;
}

function destroyHost() {
  if (!host) return;
  const current = host;
  host = null;
  current.destroy();
}

/**
 * Registers a view and returns its unregister function. The host is created on
 * the first registration and torn down — context and all — when the last view
 * goes away.
 */
export function registerView(view: SceneView): () => void {
  return getSceneHost().register(view);
}

/** Request a frame: call after changing anything a view draws. */
export function invalidateScenes() {
  host?.invalidate();
}

/** Declare whether a view still needs frames. */
export function setViewActive(element: HTMLElement, active: boolean) {
  host?.setActive(element, active);
}

/** Test hook: how many live views the host is driving. */
export function liveViewCount(): number {
  return host ? (host as unknown as { views: Set<unknown> }).views.size : 0;
}
