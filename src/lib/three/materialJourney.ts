import * as THREE from 'three';

/**
 * The material's journey (§8.4): limestone, crushing, fine grinding, powder.
 *
 * One point cloud of 36,000 particles carries all four stages. Each particle
 * holds four positions as vertex attributes and the shader blends between the
 * two that bracket the scroll value, so the transition happens entirely on the
 * GPU — no buffer is rewritten while scrubbing, in either direction.
 *
 * A point cloud rather than instanced solids is the right tool here because the
 * subject *is* the particles: the sequence exists to show one mass of stone
 * becoming a powder, which needs tens of thousands of elements to read at all.
 */

export type JourneyScene = {
  /** 0..3, continuous across the four stages. */
  setProgress: (p: number) => void;
  dispose: () => void;
};

const COUNT = 36000;

const VERTEX = /* glsl */ `
  attribute vec3 p0;
  attribute vec3 p1;
  attribute vec3 p2;
  attribute vec3 p3;
  attribute float aSize;
  attribute float aSeed;

  // Precision is stated explicitly on every uniform shared between the two
  // stages: a uniform that is highp in the vertex shader and mediump in the
  // fragment shader fails link validation on strict drivers.
  uniform highp float uProgress;  // 0..3
  uniform highp float uTime;
  uniform highp float uPixelRatio;

  varying float vDepth;
  varying float vSeed;

  void main() {
    float t = clamp(uProgress, 0.0, 3.0);
    float i = floor(t);
    float f = t - i;
    // Exponential ease-out on the blend: the stage settles instead of arriving
    // at a constant rate (§11 forbids linear).
    f = 1.0 - pow(1.0 - f, 3.0);

    vec3 a = i < 0.5 ? p0 : (i < 1.5 ? p1 : (i < 2.5 ? p2 : p3));
    vec3 b = i < 0.5 ? p1 : (i < 1.5 ? p2 : (i < 2.5 ? p3 : p3));
    vec3 pos = mix(a, b, f);

    // A slow drift, strongest in the ground stage where the material is airborne.
    float airborne = smoothstep(1.4, 2.2, t) * (1.0 - smoothstep(2.6, 3.0, t));
    pos += vec3(
      sin(uTime * 0.4 + aSeed * 6.283) * 0.05,
      cos(uTime * 0.33 + aSeed * 4.712) * 0.05,
      sin(uTime * 0.27 + aSeed * 2.094) * 0.05
    ) * airborne;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mv.z;
    vSeed = aSeed;

    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (3.4 / max(0.4, -mv.z));
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;

  // Must match the vertex stage's precision for the same uniform.
  uniform highp float uProgress;

  varying float vDepth;
  varying float vSeed;

  void main() {
    // Round, soft-edged points. The only curve on the site that is not a
    // rendered particle is none: this is inside a canvas, not a UI surface.
    vec2 d = gl_PointCoord - vec2(0.5);
    float r = dot(d, d);
    if (r > 0.25) discard;
    float edge = 1.0 - smoothstep(0.16, 0.25, r);

    // White solid, indigo shadow: colour comes from the lighting model, not the
    // material (§10). Nearer particles read white, deeper ones fall to indigo.
    vec3 white  = vec3(1.0);
    vec3 indigo = vec3(0.239, 0.333, 0.643);
    float lit = clamp(1.0 - (vDepth - 2.2) / 3.4, 0.0, 1.0);
    vec3 col = mix(indigo, white, lit * (0.55 + 0.45 * vSeed));

    // In the final stage the light passes through the powder and lifts the white.
    float settled = smoothstep(2.3, 3.0, uProgress);
    col = mix(col, white, settled * 0.5);

    float alpha = edge * (0.32 + 0.52 * lit);
    gl_FragColor = vec4(col, alpha);
  }
`;

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function createJourneyScene({ canvas }: { canvas: HTMLCanvasElement }): JourneyScene {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false, // points are already soft-edged; MSAA buys nothing here
    powerPreference: 'low-power',
  });
  renderer.setClearAlpha(0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0.35, 4.2);
  camera.lookAt(0, 0, 0);

  const rand = rng(7);

  const p0 = new Float32Array(COUNT * 3); // limestone: a solid rough block
  const p1 = new Float32Array(COUNT * 3); // crushed: rubble clusters
  const p2 = new Float32Array(COUNT * 3); // ground: an airborne cloud
  const p3 = new Float32Array(COUNT * 3); // powder: a settled wave surface
  const sizes = new Float32Array(COUNT);
  const seeds = new Float32Array(COUNT);

  // A handful of rubble centres, so stage 2 reads as broken lumps rather than
  // uniform noise.
  const clusters = Array.from({ length: 14 }, () => ({
    x: (rand() - 0.5) * 2.9,
    y: (rand() - 0.5) * 1.5,
    z: (rand() - 0.5) * 1.8,
    r: 0.16 + rand() * 0.22,
  }));

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    seeds[i] = rand();
    sizes[i] = 0.9 + rand() * 1.5;

    /* --- 01 limestone: a rough-surfaced block ---------------------------- */
    // Biased toward the shell so the mass reads as a solid, not a fog.
    const shell = Math.pow(rand(), 0.35);
    const bx = (rand() - 0.5) * 2;
    const by = (rand() - 0.5) * 2;
    const bz = (rand() - 0.5) * 2;
    const len = Math.max(Math.abs(bx), Math.abs(by), Math.abs(bz)) || 1;
    p0[i3] = bx * (shell / len) * 1.05;
    p0[i3 + 1] = by * (shell / len) * 0.82;
    p0[i3 + 2] = bz * (shell / len) * 1.0;
    // Surface roughness on the block face.
    p0[i3] += (rand() - 0.5) * 0.08;
    p0[i3 + 1] += (rand() - 0.5) * 0.08;

    /* --- 02 crushed: rubble clusters ------------------------------------- */
    const c = clusters[Math.floor(rand() * clusters.length)];
    p1[i3] = c.x + (rand() - 0.5) * c.r * 2;
    p1[i3 + 1] = c.y + (rand() - 0.5) * c.r * 2;
    p1[i3 + 2] = c.z + (rand() - 0.5) * c.r * 2;

    /* --- 03 ground: an airborne cloud ------------------------------------ */
    // A wide swirl: radius and angle rather than a box, so it turns as a mass.
    const angle = rand() * Math.PI * 2;
    const radius = 0.4 + Math.pow(rand(), 0.7) * 1.9;
    p2[i3] = Math.cos(angle) * radius;
    p2[i3 + 1] = (rand() - 0.5) * 1.6 + Math.sin(angle * 2) * 0.18;
    p2[i3 + 2] = Math.sin(angle) * radius * 0.7;

    /* --- 04 powder: settled into a soft wave ----------------------------- */
    const px = (rand() - 0.5) * 4.2;
    const pz = (rand() - 0.5) * 2.4;
    p3[i3] = px;
    p3[i3 + 1] =
      -0.75 +
      Math.sin(px * 1.15) * 0.16 +
      Math.cos(pz * 1.5) * 0.1 +
      // A shallow thickness, so the surface is a powder bed and not a sheet.
      rand() * 0.09;
    p3[i3 + 2] = pz;
  }

  const geometry = new THREE.BufferGeometry();
  // `position` is required by three even though the shader ignores it.
  geometry.setAttribute('position', new THREE.BufferAttribute(p0, 3));
  geometry.setAttribute('p0', new THREE.BufferAttribute(p0, 3));
  geometry.setAttribute('p1', new THREE.BufferAttribute(p1, 3));
  geometry.setAttribute('p2', new THREE.BufferAttribute(p2, 3));
  geometry.setAttribute('p3', new THREE.BufferAttribute(p3, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  // The cloud spans further than `position` suggests; give it an explicit volume
  // so frustum culling never drops it mid-morph.
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 4);

  const uniforms = {
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uPixelRatio: { value: 1 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  function layout() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    uniforms.uPixelRatio.value = dpr;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  let progress = 0;
  let shown = 0;
  let raf = 0;
  let running = false;
  let visible = true;
  let last = performance.now();

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;

    shown += (progress - shown) * Math.min(1, dt * 6);
    uniforms.uProgress.value = shown;
    uniforms.uTime.value = now / 1000;

    // A very slow turn, so the mass has volume even when the scroll is parked.
    points.rotation.y = Math.sin(now / 9000) * 0.22;

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
    setProgress(p) {
      progress = Math.min(3, Math.max(0, p));
    },
    dispose() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
