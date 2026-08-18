import * as THREE from 'three';

/**
 * The morphing sector scene (§8.3) — the second of the three signature moves.
 *
 * The rule that makes this section work is that the three sectors are *not*
 * three scenes cross-faded. There is one InstancedMesh of 64 slabs, and it holds
 * three sets of target transforms:
 *
 *   0  Material  a flat-faced stone block, cracked into angled shards
 *   1  Movement  those shards reassembled into stacked marble slabs, sliding
 *   2  Energy    those slabs ranked up into a tilted panel grid facing the light
 *
 * Nothing is created or destroyed between states — the same 64 instances are
 * interpolated. That is the visual argument that three sectors are one company,
 * and it is why a cross-fade was rejected outright (§8.3, design-plan §6.1).
 *
 * The camera and the lighting never change. The solid is white or stone grey
 * throughout and every colour arrives from the indigo lighting (§8.3, §10).
 */

export type SectorScene = {
  /** 0..3 — continuous, so the morph is scrubbed rather than switched. */
  setProgress: (p: number) => void;
  dispose: () => void;
};

const COUNT = 64;

type State = {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
};

/** Deterministic pseudo-random so every visitor sees the same composition. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/**
 * State 1 — a stone block broken into angled shards. The instances fill a rough
 * cube and each is rotated onto an oblique angle, so the mass reads as fractured
 * rather than stacked.
 */
function stoneState(): State[] {
  const rand = rng(11);
  const out: State[] = [];
  const perSide = 4; // 4 x 4 x 4 = 64
  for (let x = 0; x < perSide; x++) {
    for (let y = 0; y < perSide; y++) {
      for (let z = 0; z < perSide; z++) {
        const jitter = 0.16;
        const position = new THREE.Vector3(
          (x - 1.5) * 0.52 + (rand() - 0.5) * jitter,
          (y - 1.5) * 0.52 + (rand() - 0.5) * jitter,
          (z - 1.5) * 0.52 + (rand() - 0.5) * jitter
        );
        // Angles drawn from the 45deg family, never arbitrary (§5.4.1).
        const quaternion = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            (Math.round(rand() * 2 - 1) * Math.PI) / 4 + (rand() - 0.5) * 0.24,
            (rand() - 0.5) * 0.6,
            (Math.round(rand() * 2 - 1) * Math.PI) / 4 + (rand() - 0.5) * 0.24
          )
        );
        const s = 0.34 + rand() * 0.2;
        out.push({ position, quaternion, scale: new THREE.Vector3(s, s * 0.72, s) });
      }
    }
  }
  return out;
}

/**
 * State 2 — stacked marble slabs. The shards flatten and rank into four leaning
 * stacks, each slab offset along its length as though being loaded.
 */
function slabState(dirSign: 1 | -1): State[] {
  const rand = rng(29);
  const out: State[] = [];
  const stacks = 4;
  const perStack = COUNT / stacks;
  for (let s = 0; s < stacks; s++) {
    for (let i = 0; i < perStack; i++) {
      // Uneven horizontal offsets: a loaded stack is never flush.
      const slide = (rand() - 0.2) * 0.5 * dirSign;
      const position = new THREE.Vector3(
        (s - 1.5) * 0.66 + slide,
        (i - perStack / 2) * 0.1 + 0.05,
        (rand() - 0.5) * 0.12
      );
      const quaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, (rand() - 0.5) * 0.08, 0)
      );
      out.push({
        position,
        quaternion,
        scale: new THREE.Vector3(0.56, 0.07, 0.92),
      });
    }
  }
  return out;
}

/**
 * State 3 — a grid of solar panels at a uniform tilt. The slabs rank up into 8x8
 * and lean toward the light; the regularity after two irregular states is the
 * point of the sequence.
 */
function panelState(): State[] {
  const out: State[] = [];
  const side = 8;
  const tilt = -Math.PI / 7;
  for (let x = 0; x < side; x++) {
    for (let z = 0; z < side; z++) {
      const position = new THREE.Vector3(
        (x - (side - 1) / 2) * 0.3,
        // A shallow rise across the field, so the grid is not a flat plane.
        (z - (side - 1) / 2) * 0.06,
        (z - (side - 1) / 2) * 0.3
      );
      const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(tilt, 0, 0));
      out.push({ position, quaternion, scale: new THREE.Vector3(0.26, 0.02, 0.18) });
    }
  }
  return out;
}

export function createSectorScene({
  canvas,
  dirSign = 1,
}: {
  canvas: HTMLCanvasElement;
  /** Marble slabs slide along the reading direction, so RTL reverses it (§8.3). */
  dirSign?: 1 | -1;
}): SectorScene {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  renderer.setClearAlpha(0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(3.1, 2.3, 3.6);
  camera.lookAt(0, 0, 0);

  /* --- lighting (§10): white key, indigo rim, indigo fill. The solid is white;
     all colour comes from the light, which is what keeps the scene in the
     identity without tinting the material. ---------------------------------- */
  scene.add(new THREE.HemisphereLight(0xffffff, 0x1b1f4e, 0.55));

  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(2.6, 4, 2.2);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x3d55a4, 2.4);
  rim.position.set(-3, 1.2, -2.4);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(0x2b3073, 1.1);
  fill.position.set(-1.4, -2.2, 2.6);
  scene.add(fill);

  /* --- the one instanced mesh -------------------------------------------- */
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    // Stone white. Never a different colour per sector (§8.3).
    color: 0xf2f0ec,
    roughness: 0.62,
    metalness: 0.02,
    flatShading: true,
  });

  const mesh = new THREE.InstancedMesh(geometry, material, COUNT);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(mesh);

  const states = [stoneState(), slabState(dirSign), panelState()];

  const tmpMatrix = new THREE.Matrix4();
  const tmpPos = new THREE.Vector3();
  const tmpQuat = new THREE.Quaternion();
  const tmpScale = new THREE.Vector3();

  let progress = 0;
  /** Smoothed progress, so a jumpy scroll does not snap the geometry. */
  let shown = 0;

  function writeInstances(p: number) {
    // p in 0..2 across three states.
    const clamped = Math.min(1.999, Math.max(0, p));
    const from = Math.floor(clamped);
    const to = Math.min(states.length - 1, from + 1);
    const raw = clamped - from;
    // Exponential ease-out on the blend: the morph settles rather than arriving
    // at constant speed (§11 forbids linear).
    const t = 1 - Math.pow(1 - raw, 3);

    const a = states[from];
    const b = states[to];

    for (let i = 0; i < COUNT; i++) {
      tmpPos.lerpVectors(a[i].position, b[i].position, t);
      tmpQuat.slerpQuaternions(a[i].quaternion, b[i].quaternion, t);
      tmpScale.lerpVectors(a[i].scale, b[i].scale, t);
      tmpMatrix.compose(tmpPos, tmpQuat, tmpScale);
      mesh.setMatrixAt(i, tmpMatrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  function layout() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  /* --- loop -------------------------------------------------------------- */
  let raf = 0;
  let running = false;
  let visible = true;
  let last = performance.now();

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;

    // Critically-damped approach to the scroll value.
    shown += (progress - shown) * Math.min(1, dt * 7);

    writeInstances(shown);

    // The light the panels lean toward drifts, so state 3 has life in it while
    // the scroll is parked.
    const t = now / 1000;
    key.position.set(2.6 + Math.sin(t * 0.22) * 0.9, 4, 2.2 + Math.cos(t * 0.22) * 0.9);

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
  writeInstances(0);
  start();

  return {
    setProgress(p) {
      progress = Math.min(2, Math.max(0, p));
    },
    dispose() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      geometry.dispose();
      material.dispose();
      mesh.dispose();
      renderer.dispose();
    },
  };
}
