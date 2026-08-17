import * as THREE from 'three';

/**
 * The calcite crystal explorer on /calcium-carbonate (§9).
 *
 * A solid rhombohedron this time rather than the hero's refracting shell — the
 * subject here is the *structure*, so the faces, the cleavage planes and the
 * oblique corners are what the visitor needs to see. It rotates to face whichever
 * feature the reader selected.
 *
 * §10: drag is armed only after a deliberate press, so a touch visitor scrolling
 * past is never captured by the canvas.
 */

export type CalciteExplorerScene = {
  focusFace: (index: number) => void;
  dispose: () => void;
};

/** Orientations that present each explained feature to the camera. */
const VIEWS: { x: number; y: number }[] = [
  { x: 0.34, y: 0.7 }, // the rhombohedral form: three faces at once
  { x: 0.1, y: -0.55 }, // double refraction: looking through a face
  { x: 0.62, y: 2.25 }, // the same material: the cleavage planes edge-on
];

function rhombohedron(): THREE.BufferGeometry {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const s = 0.34;
  geometry.applyMatrix4(
    new THREE.Matrix4().set(1, s, s, 0, s, 1, s, 0, s, s, 1, 0, 0, 0, 0, 1)
  );
  geometry.computeVertexNormals();
  return geometry;
}

export function createCalciteExplorer({
  canvas,
}: {
  canvas: HTMLCanvasElement;
}): CalciteExplorerScene {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  renderer.setClearAlpha(0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 4.2);

  /* Lighting per §10: dim studio ambient, cool white key, a --brand-mid rim that
     draws the crystal's edges, and a faint --brand fill. The solid is white; all
     colour arrives from the light. */
  scene.add(new THREE.HemisphereLight(0xffffff, 0x1b1f4e, 0.5));

  const key = new THREE.DirectionalLight(0xf4f7ff, 1.6);
  key.position.set(2.4, 3, 2.6);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x3d55a4, 3.2);
  rim.position.set(-2.8, 0.6, -2);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(0x2b3073, 1.2);
  fill.position.set(-1, -2.4, 2);
  scene.add(fill);

  const geometry = rhombohedron();
  const group = new THREE.Group();

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.14,
    metalness: 0,
    transmission: 0.72,
    thickness: 1.1,
    ior: 1.66, // calcite's actual refractive index, near enough to name it
    transparent: true,
    flatShading: true,
  });

  const crystal = new THREE.Mesh(geometry, material);
  crystal.scale.setScalar(1.06);
  group.add(crystal);

  // Cleavage edges, drawn as real lines so the geometry reads at any size.
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, 1),
    new THREE.LineBasicMaterial({ color: 0xdce2f5, transparent: true, opacity: 0.62 })
  );
  edges.scale.setScalar(1.06);
  group.add(edges);

  scene.add(group);

  /* ------------------------------------------------------------ interaction */
  const target = { x: VIEWS[0].x, y: VIEWS[0].y };
  const current = { x: VIEWS[0].x, y: VIEWS[0].y };

  // Drag is only armed after a press on the canvas, and the canvas never
  // consumes wheel or touch-scroll (§10).
  let dragging = false;
  let lastPointer = { x: 0, y: 0 };

  const onPointerDown = (event: PointerEvent) => {
    dragging = true;
    lastPointer = { x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent) => {
    if (!dragging) return;
    target.y += (event.clientX - lastPointer.x) * 0.008;
    target.x += (event.clientY - lastPointer.y) * 0.006;
    target.x = Math.max(-1.1, Math.min(1.1, target.x));
    lastPointer = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: PointerEvent) => {
    dragging = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  };

  // pointer-events is off in CSS for scene canvases; enable it just for this one,
  // which is the only scene meant to be handled.
  canvas.style.pointerEvents = 'auto';
  canvas.style.touchAction = 'pan-y';
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);

  function layout() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  let raf = 0;
  let running = false;
  let visible = true;
  let last = performance.now();

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;

    // Ease toward the selected view; never linear (§11).
    const k = Math.min(1, dt * 3.4);
    current.x += (target.x - current.x) * k;
    current.y += (target.y - current.y) * k;

    // A slow idle drift while nobody is dragging, so the solid has volume.
    const idle = dragging ? 0 : Math.sin(now / 6000) * 0.06;
    group.rotation.set(current.x, current.y + idle, 0);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || !visible) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    },
    { threshold: 0 }
  );
  io.observe(canvas);

  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);

  const ro = new ResizeObserver(layout);
  ro.observe(canvas);

  layout();
  start();

  return {
    focusFace(index) {
      const view = VIEWS[index] ?? VIEWS[0];
      target.x = view.x;
      target.y = view.y;
    },
    dispose() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      geometry.dispose();
      material.dispose();
      edges.geometry.dispose();
      (edges.material as THREE.Material).dispose();
      renderer.dispose();
    },
  };
}
