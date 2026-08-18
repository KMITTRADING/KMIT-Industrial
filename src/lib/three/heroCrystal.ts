import * as THREE from 'three';

/**
 * The calcite rhombohedron and its double refraction (§8.1).
 *
 * How the effect works, and why it is built this way:
 *
 * The heading must stay real DOM text — it is the LCP element and the page's H1
 * (§15.1). So the crystal cannot refract the DOM; nothing can. Instead the
 * heading is redrawn once into a 2D canvas at exactly the position it occupies in
 * the layout, and that canvas becomes a texture. The crystal's shader samples it
 * twice, at two offsets, which is precisely what calcite does to light: the
 * ordinary ray passes straight and the extraordinary ray is displaced, so you see
 * two images.
 *
 * Outside the crystal the canvas is transparent and the real heading shows
 * through. Inside it, the crystal covers the heading and presents its own split
 * copy. The two register because the WebGL canvas, the text canvas and the
 * heading all share one box and one pixel coordinate system, held by an
 * orthographic camera measured in CSS pixels.
 *
 * The crystal is a sheared cube: six flat rhombic faces meeting at oblique
 * angles, zero curves — the same geometry as the KMIT mark (§5.4.1).
 */

export type HeroScene = {
  dispose: () => void;
  /** Redraw the heading texture, e.g. after a font swap or a resize. */
  refreshText: () => void;
};

type Options = {
  canvas: HTMLCanvasElement;
  /** The heading block. Defines the pixel box shared by every layer. */
  box: HTMLElement;
  /** The two heading line elements, measured for the text texture. */
  lineEls: HTMLElement[];
  dir: 'rtl' | 'ltr';
};

const VERTEX = /* glsl */ `
  varying vec3 vNormalView;
  void main() {
    vNormalView = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;

  uniform sampler2D uText;
  uniform vec2  uRes;      // canvas size in device pixels
  uniform float uSplit;    // separation of the two rays, in CSS px
  uniform float uRefract;  // displacement from the face normal, in CSS px
  uniform float uAngle;    // orientation of the split axis
  uniform float uDpr;

  varying vec3 vNormalView;

  void main() {
    vec3 N = normalize(vNormalView);

    // Under an orthographic camera the view vector is constant, so a Fresnel
    // term alone gives every front face almost the same value and the solid
    // reads as a smear. The facets are separated by a fixed key direction
    // instead, which is the same lighting model the SVG fallback draws.
    vec3 KEY = normalize(vec3(0.42, 0.76, 0.5));
    float facet = clamp(dot(N, KEY) * 0.5 + 0.5, 0.0, 1.0);

    // Flat-shaded faces hold a constant normal, so the normal's screen-space
    // derivative spikes exactly on the edges between them. That draws the
    // internal edges of the rhombohedron without a second pass.
    float edge = clamp(length(fwidth(N)) * 2.4, 0.0, 1.0);

    float facing = clamp(abs(N.z), 0.0, 1.0);
    float rim = pow(1.0 - facing, 3.0);

    vec2 px = gl_FragCoord.xy / uDpr;          // CSS pixels
    vec2 uv = vec2(px.x, (uRes.y / uDpr) - px.y) / (uRes / uDpr);

    // Refraction through the face, then the birefringent split.
    vec2 disp  = (N.xy * uRefract) / (uRes / uDpr);
    vec2 split = (vec2(cos(uAngle), sin(uAngle)) * uSplit) / (uRes / uDpr);

    vec2 uvO = uv + disp;
    vec2 uvE = uvO + split;

    // The text canvas is white on transparent, so alpha is the coverage.
    float o = texture2D(uText, uvO).a;
    float e = texture2D(uText, uvE).a;

    // Colour comes from the lighting, never from the solid (§10).
    vec3 bodyDeep = vec3(0.106, 0.121, 0.306);  // --brand-deep
    vec3 bodyMid  = vec3(0.239, 0.333, 0.643);  // --brand-mid
    vec3 rayO     = vec3(1.0);
    vec3 rayE     = vec3(0.561, 0.643, 0.863);  // --brand-mid lifted toward white

    vec3 col = mix(bodyDeep, bodyMid, facet);
    float a  = 0.20 + facet * 0.24 + rim * 0.30;

    // Extraordinary ray first, ordinary ray over it: the near image reads sharper.
    col = mix(col, rayE, e * 0.62);
    a   = max(a, e * 0.62);
    col = mix(col, rayO, o * 0.88);
    a   = max(a, o * 0.88);

    // Edges last, so they sit on top of the refracted text and give the solid
    // its outline (§10: the rim light is --brand-mid).
    col = mix(col, vec3(0.62, 0.70, 0.92), edge * 0.9);
    a   = max(a, edge * 0.85);

    gl_FragColor = vec4(col, a);
  }
`;

/** A calcite rhombohedron: a unit cube sheared so its faces become rhombs. */
function rhombohedronGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  // Equal off-diagonal shear turns the cube into a rhombohedron whose faces all
  // meet at the same oblique angle, which is how calcite actually cleaves.
  const s = 0.34;
  const shear = new THREE.Matrix4().set(
    1, s, s, 0,
    s, 1, s, 0,
    s, s, 1, 0,
    0, 0, 0, 1
  );
  geometry.applyMatrix4(shear);

  // Stand it on a body diagonal so a vertex points up, then recompute the flat
  // face normals the shear invalidated.
  geometry.applyMatrix4(
    new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(Math.PI / 5.2, 0, Math.PI / 4))
  );
  geometry.computeVertexNormals();
  return geometry;
}

export function createHeroScene({ canvas, box, lineEls, dir }: Options): HeroScene {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  renderer.setClearAlpha(0);

  const scene = new THREE.Scene();
  // Orthographic, measured in CSS pixels with y running down, so scene
  // coordinates and layout coordinates are the same numbers.
  const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -2000, 2000);

  const textCanvas = document.createElement('canvas');
  const textTexture = new THREE.CanvasTexture(textCanvas);
  textTexture.minFilter = THREE.LinearFilter;
  textTexture.magFilter = THREE.LinearFilter;
  // Sampling outside the crystal's own area must not wrap the heading around.
  textTexture.wrapS = THREE.ClampToEdgeWrapping;
  textTexture.wrapT = THREE.ClampToEdgeWrapping;

  const uniforms = {
    uText: { value: textTexture },
    uRes: { value: new THREE.Vector2(1, 1) },
    uSplit: { value: 7 },
    uRefract: { value: 16 },
    uAngle: { value: 0 },
    uDpr: { value: 1 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms,
    transparent: true,
    // A convex solid drawn front-face only needs no depth sorting against itself.
    depthWrite: false,
    side: THREE.FrontSide,
  });

  const geometry = rhombohedronGeometry();
  const crystal = new THREE.Mesh(geometry, material);

  /*
   * The silhouette and cleavage edges as real line geometry. A derivative-based
   * edge in the fragment shader draws the *internal* boundaries but can never
   * draw the outer silhouette, because there is no neighbouring face there to
   * differ from — and without a crisp outline the solid reads as a smear rather
   * than a crystal.
   */
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, 1),
    new THREE.LineBasicMaterial({
      color: 0x9fb0e0, // --brand-mid lifted toward white: the rim light (§10)
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    })
  );

  // One group so the mesh and its edges share a single transform.
  const crystalGroup = new THREE.Group();
  crystalGroup.add(crystal);
  crystalGroup.add(edges);
  scene.add(crystalGroup);

  /* ---------------------------------------------------------------- text --- */

  /**
   * Redraws the heading into the texture canvas at the exact pixel position it
   * occupies in the layout. The browser does the shaping, so Arabic joins and
   * orders correctly — which is the whole reason this is a 2D canvas and not a
   * generated glyph atlas.
   */
  function drawText() {
    const boxRect = box.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const w = Math.max(1, Math.round(boxRect.width * dpr));
    const h = Math.max(1, Math.round(boxRect.height * dpr));

    if (textCanvas.width !== w || textCanvas.height !== h) {
      textCanvas.width = w;
      textCanvas.height = h;
    }

    const ctx = textCanvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'alphabetic';
    ctx.direction = dir;
    ctx.textAlign = dir === 'rtl' ? 'right' : 'left';

    for (const line of lineEls) {
      const rect = line.getBoundingClientRect();
      const style = getComputedStyle(line);
      const size = parseFloat(style.fontSize);
      const weight = style.fontWeight || '600';
      const family = style.fontFamily || 'Alexandria, sans-serif';
      ctx.font = `${weight} ${size}px ${family}`;
      ctx.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing;

      // Baseline: the line box top plus the font's ascent. Using the metrics of
      // the actual text avoids guessing at line-height distribution.
      const metrics = ctx.measureText(line.textContent ?? '');
      const ascent = metrics.actualBoundingBoxAscent || size * 0.75;
      const lineBoxCentre = rect.top - boxRect.top + rect.height / 2;
      const descent = metrics.actualBoundingBoxDescent || size * 0.2;
      const baseline = lineBoxCentre + (ascent - descent) / 2;

      const x = dir === 'rtl' ? rect.right - boxRect.left : rect.left - boxRect.left;
      ctx.fillText(line.textContent ?? '', x, baseline);
    }

    textTexture.needsUpdate = true;
  }

  /* -------------------------------------------------------------- layout --- */

  function layout() {
    const rect = box.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);

    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    camera.left = 0;
    camera.right = w;
    camera.top = 0;
    camera.bottom = -h;
    camera.updateProjectionMatrix();

    uniforms.uRes.value.set(w * dpr, h * dpr);
    uniforms.uDpr.value = dpr;

    // Read the crystal's centre and half-extent from the same custom properties
    // the CSS fallback uses, so both paths place it identically.
    const cs = getComputedStyle(box);
    const cx = resolveLength(cs.getPropertyValue('--cx'), w);
    const cy = resolveLength(cs.getPropertyValue('--cy'), h);
    const r = resolveLength(cs.getPropertyValue('--r'), Math.min(w, h));

    crystalGroup.position.set(cx, -cy, 0);
    // The geometry is a unit cube, so it spans -0.5..0.5 before the shear. `r`
    // is a half-extent, which means the scale factor is 2r, not r — at r the
    // crystal came out half the size the CSS fallback draws.
    crystalGroup.scale.setScalar(r * 2);

    // Displacement scales with the crystal, so the effect reads the same at any
    // size instead of vanishing on small screens.
    uniforms.uRefract.value = r * 0.2;
    uniforms.uSplit.value = Math.max(6, r * 0.075);

    drawText();
  }

  /* ---------------------------------------------------------------- loop --- */

  let raf = 0;
  let running = false;
  let visible = true;
  let last = performance.now();
  // A full revolution takes 40 seconds (§8.1).
  const SPEED = (Math.PI * 2) / 40;

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;

    crystalGroup.rotation.y += SPEED * dt;
    // The split axis turns with the crystal: the optic axis is fixed in the
    // solid, not on the screen.
    uniforms.uAngle.value = crystalGroup.rotation.y * 0.5;

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

  /* --------------------------------------------------- lifecycle wiring --- */

  // §10: the loop stops when the scene leaves the viewport, and when the tab
  // is hidden. A rotating crystal nobody can see is pure battery cost.
  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    },
    { threshold: 0 }
  );
  io.observe(box);

  const onVisibility = () => {
    if (document.hidden) stop();
    else start();
  };
  document.addEventListener('visibilitychange', onVisibility);

  const ro = new ResizeObserver(() => layout());
  ro.observe(box);

  // The heading is drawn with Alexandria; until it loads the metrics are the
  // fallback font's and the texture would not match the DOM.
  document.fonts?.ready.then(() => {
    layout();
  });

  layout();
  start();

  return {
    refreshText: layout,
    dispose() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      // §10: every GPU resource is released explicitly.
      geometry.dispose();
      material.dispose();
      edges.geometry.dispose();
      (edges.material as THREE.Material).dispose();
      textTexture.dispose();
      renderer.dispose();
    },
  };
}

/** Resolves a CSS length or percentage against a reference size, in px. */
function resolveLength(raw: string, reference: number): number {
  const value = raw.trim();
  if (!value) return reference / 2;
  if (value.endsWith('%')) return (parseFloat(value) / 100) * reference;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : reference / 2;
}
