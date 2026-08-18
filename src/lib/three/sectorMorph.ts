import * as THREE from 'three';
import { registerView, getSceneHost, invalidateScenes } from './sceneHost';
import {
  bevelledBox,
  contactShadow,
  lightScene,
  marbleMaterial,
  productCamera,
  solarMaterial,
  stoneMaterial,
} from './studio';

/**
 * The morphing sector scene (§8.3) — material, movement, energy.
 *
 * The morph itself is unchanged in spirit: one fixed set of solids holds three
 * target states and interpolates between them, so nothing is created or
 * destroyed as the sectors change. What changed is everything about how it looks
 * and what it costs.
 *
 * Look (§C):
 *  - every solid is bevelled, so its edges catch light instead of vanishing
 *  - the scene has a studio environment, without which PBR renders flat grey
 *  - a contact shadow puts the mass on a ground instead of in a void
 *  - a 30-degree lens, three-quarter view, subject filling ~66% of the frame
 *  - C6: 10 fragments at varied sizes rather than 64 identical chips; slabs with
 *    real thickness and a distinct edge colour; solar panels in reflective glass
 *
 * Cost (§B):
 *  - draws into the shared canvas, so it owns no WebGL context of its own
 *  - reports "settled" once the morph has caught up with the scroll, and the
 *    host then stops drawing frames entirely
 */

export type SectorScene = {
  /** 0..2 — continuous, so the morph is scrubbed rather than switched. */
  setProgress: (p: number) => void;
  dispose: () => void;
};

/** Per-solid target transform in one state. */
type Placement = {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
};

/**
 * C6 asks for 8-12 fragments with at least a 1:4 size range, not a heap of
 * identical chips. Ten solids carry all three states.
 */
const COUNT = 10;

/** Deterministic, so every visitor sees the same composition. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const place = (
  position: [number, number, number],
  euler: [number, number, number],
  scale: [number, number, number]
): Placement => ({
  position: new THREE.Vector3(...position),
  quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(...euler)),
  scale: new THREE.Vector3(...scale),
});

/**
 * State 1 — one large block broken into angled shards. Sizes run from 0.28 to
 * 1.15 on the long axis, comfortably past the 1:4 range C6 asks for, so the mass
 * reads as fractured stone rather than gravel.
 */
function stoneState(): Placement[] {
  const rand = rng(17);
  const out: Placement[] = [];
  // The two dominant pieces: a block and the wedge that split off it.
  out.push(place([-0.18, 0.12, 0], [0.08, 0.42, 0.05], [1.15, 0.9, 0.95]));
  out.push(place([0.62, -0.1, 0.16], [0.5, -0.3, 0.78], [0.62, 0.7, 0.58]));
  // Mid-sized shards along the fracture line.
  out.push(place([0.28, 0.62, -0.3], [Math.PI / 4, 0.2, 0.3], [0.44, 0.36, 0.5]));
  out.push(place([-0.72, -0.34, 0.34], [-0.3, 0.6, Math.PI / 4], [0.4, 0.46, 0.38]));
  out.push(place([0.1, -0.6, -0.24], [0.2, -0.5, -0.4], [0.52, 0.3, 0.44]));
  // Small chips, still varied.
  for (let i = out.length; i < COUNT; i++) {
    const angle = rand() * Math.PI * 2;
    const radius = 0.85 + rand() * 0.5;
    const s = 0.16 + rand() * 0.16;
    out.push(
      place(
        [Math.cos(angle) * radius, (rand() - 0.5) * 1.1, Math.sin(angle) * radius * 0.7],
        [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI],
        [s, s * (0.6 + rand() * 0.5), s * (0.7 + rand() * 0.6)]
      )
    );
  }
  return out;
}

/**
 * State 2 — stacked marble slabs. C6: real thickness, offset along their length
 * as though being loaded, and an edge that reads differently from the face.
 */
function slabState(dirSign: 1 | -1): Placement[] {
  const out: Placement[] = [];
  for (let i = 0; i < COUNT; i++) {
    const tier = Math.floor(i / 2);
    const withinTier = i % 2;
    // Uneven slide: a loaded stack is never flush.
    const slide = (0.16 + tier * 0.13 + withinTier * 0.22) * dirSign;
    out.push(
      place(
        [slide - 0.35, -0.62 + tier * 0.2 + withinTier * 0.095, withinTier * 0.5 - 0.25],
        [0, (withinTier === 0 ? 0.03 : -0.04) + tier * 0.01, 0],
        [1.5, 0.09, 0.72]
      )
    );
  }
  return out;
}

/**
 * State 3 — a tilted panel array. Regularity after two irregular states is the
 * point of the sequence.
 */
function panelState(): Placement[] {
  const out: Placement[] = [];
  const cols = 5;
  const tilt = -Math.PI / 7;
  for (let i = 0; i < COUNT; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    out.push(
      place(
        [(col - (cols - 1) / 2) * 0.62, -0.3 + row * 0.16, (row - 0.5) * 0.86],
        [tilt, 0, 0],
        [0.56, 0.035, 0.4]
      )
    );
  }
  return out;
}

export function createSectorScene({
  element,
  dirSign = 1,
}: {
  element: HTMLElement;
  dirSign?: 1 | -1;
}): SectorScene {
  const host = getSceneHost();

  const scene = new THREE.Scene();
  const envMap = lightScene(scene, host.renderer);

  /* C5: product lens. The subject is about 2.2 units tall and should fill two
     thirds of the frame; the camera distance is solved from that rather than
     guessed, and the angle is a three-quarter view. */
  // C5: the subject should fill 60-70% of the frame. Framed against the subject's
  // own extent rather than a guess, and the box is landscape so the vertical fit
  // is the binding one.
  const { camera, distance } = productCamera(2.0, 0.88, 30);
  camera.position.set(distance * 0.58, distance * 0.44, distance * 0.68);
  camera.lookAt(0, -0.25, 0);

  /* The environment does most of the lighting. Two directional lights remain to
     give a definite key direction and the --brand-mid rim the identity calls for. */
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 5, 2.5);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x3d55a4, 2.4);
  rim.position.set(-3.5, 1.2, -3);
  scene.add(rim);

  /* --- the solids ------------------------------------------------------- */
  const states = [stoneState(), slabState(dirSign), panelState()];

  // One bevelled unit cube, instanced per solid by scaling. The bevel is small
  // relative to the unit box so it survives non-uniform scaling as a crisp edge.
  const geometry = bevelledBox(1, 1, 1, 0.045, 3);

  const stone = stoneMaterial(envMap);
  const marble = marbleMaterial(envMap);
  const solar = solarMaterial(envMap);

  const meshes: THREE.Mesh[] = [];
  for (let i = 0; i < COUNT; i++) {
    const mesh = new THREE.Mesh(geometry, stone);
    scene.add(mesh);
    meshes.push(mesh);
  }

  /* §3: no floor plane. The canvas is transparent and the light section ground
     shows straight through; only the contact pool gives the solids weight. */
  const shadow = contactShadow(4.2, 3.0, -0.9);
  scene.add(shadow);

  /* --- morph ------------------------------------------------------------ */
  const tmpPos = new THREE.Vector3();
  const tmpQuat = new THREE.Quaternion();
  const tmpScale = new THREE.Vector3();

  let target = 0;
  let shown = 0;

  function applyMaterial(p: number) {
    // Materials swap at the state the solid is closest to, so slabs are marble
    // and panels are glass rather than everything being stone.
    const nearest = Math.round(p);
    const material = nearest === 0 ? stone : nearest === 1 ? marble : solar;
    for (const mesh of meshes) {
      if (mesh.material !== material) mesh.material = material;
    }
  }

  function write(p: number) {
    const clamped = Math.min(1.999, Math.max(0, p));
    const from = Math.floor(clamped);
    const to = Math.min(states.length - 1, from + 1);
    const raw = clamped - from;
    // Exponential ease-out; never linear (§11).
    const t = 1 - Math.pow(1 - raw, 3);

    const a = states[from];
    const b = states[to];

    for (let i = 0; i < COUNT; i++) {
      tmpPos.lerpVectors(a[i].position, b[i].position, t);
      tmpQuat.slerpQuaternions(a[i].quaternion, b[i].quaternion, t);
      tmpScale.lerpVectors(a[i].scale, b[i].scale, t);
      meshes[i].position.copy(tmpPos);
      meshes[i].quaternion.copy(tmpQuat);
      meshes[i].scale.copy(tmpScale);
    }
    applyMaterial(clamped);
  }

  write(0);

  const unregister = registerView({
    element,
    scene,
    camera,
    update(dt) {
      // Critically damped approach to the scroll value.
      const delta = target - shown;
      if (Math.abs(delta) < 0.0005) {
        shown = target;
        // Settled: the host can stop drawing until the scroll moves again.
        return false;
      }
      shown += delta * Math.min(1, dt * 7);
      write(shown);
      return true;
    },
    dispose() {
      geometry.dispose();
      stone.dispose();
      marble.dispose();
      solar.dispose();
      shadow.geometry.dispose();
      (shadow.material as THREE.Material).dispose();
    },
  });

  return {
    setProgress(p) {
      const next = Math.min(2, Math.max(0, p));
      if (Math.abs(next - target) < 0.0005) return;
      target = next;
      invalidateScenes();
    },
    dispose: unregister,
  };
}
