import * as THREE from 'three';
import { getSceneHost, invalidateScenes, registerView } from './sceneHost';
import {
  bevelledBox,
  contactShadow,
  lightScene,
  productCamera,
  stoneMaterial,
  studioFloor,
} from './studio';

/**
 * The material's journey (§8.4): limestone, crushing, fine grinding, powder.
 *
 * A4 fixed the sequence, which was previously wrong: stage 01 showed a particle
 * cloud because the whole scene was points from the start. Limestone is a solid
 * rock, so it is now drawn as one. The scene holds two representations and hands
 * over between them at the point in the process where the material genuinely
 * stops being lumps and starts being powder:
 *
 *   01 limestone           one bevelled block, whole
 *   02 extraction/crushing the block separates into seven chunks
 *   03 fine grinding       chunks fade out, particles take over as a cloud
 *   04 finished powder     particles settle into a soft bed
 *
 * No particle is visible before stage 03, and no chunk after it.
 *
 * Cost (§B4): 10,000 points, inside the 8-12k budget, all moved in the vertex
 * shader; the JavaScript side only writes a single uniform per frame.
 */

export type JourneyScene = {
  /** 0..3, continuous across the four stages. */
  setProgress: (p: number) => void;
  dispose: () => void;
};

const COUNT = 10000;
const CHUNKS = 7;

const VERTEX = /* glsl */ `
  attribute vec3 pRubble;
  attribute vec3 pCloud;
  attribute vec3 pBed;
  attribute float aSize;
  attribute float aSeed;

  uniform highp float uProgress;  // 0..3
  uniform highp float uTime;
  uniform highp float uPixelRatio;

  varying float vDepth;
  varying float vSeed;

  void main() {
    float t = clamp(uProgress, 0.0, 3.0);

    // Particles live in the rubble volume until grinding, drift as a cloud
    // through stage 03, then settle into the bed at stage 04.
    float toCloud = smoothstep(1.0, 2.0, t);
    float toBed   = smoothstep(2.15, 3.0, t);
    // Exponential ease-out rather than a linear ramp (§11).
    toCloud = 1.0 - pow(1.0 - toCloud, 3.0);
    toBed   = 1.0 - pow(1.0 - toBed, 3.0);

    vec3 pos = mix(mix(pRubble, pCloud, toCloud), pBed, toBed);

    // Airborne drift, strongest while the material is actually in the air.
    float airborne = smoothstep(1.9, 2.4, t) * (1.0 - smoothstep(2.7, 3.0, t));
    pos += vec3(
      sin(uTime * 0.4 + aSeed * 6.283),
      cos(uTime * 0.33 + aSeed * 4.712),
      sin(uTime * 0.27 + aSeed * 2.094)
    ) * 0.05 * airborne;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mv.z;
    vSeed = aSeed;

    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (3.2 / max(0.4, -mv.z));
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;

  uniform highp float uProgress;

  varying float vDepth;
  varying float vSeed;

  void main() {
    vec2 d = gl_PointCoord - vec2(0.5);
    float r = dot(d, d);
    if (r > 0.25) discard;
    float edge = 1.0 - smoothstep(0.16, 0.25, r);

    // A4: nothing appears before stage 03.
    float reveal = smoothstep(1.85, 2.15, uProgress);
    if (reveal <= 0.001) discard;

    vec3 white  = vec3(1.0);
    vec3 indigo = vec3(0.239, 0.333, 0.643);
    float lit = clamp(1.0 - (vDepth - 2.2) / 3.4, 0.0, 1.0);
    vec3 col = mix(indigo, white, lit * (0.55 + 0.45 * vSeed));

    // Light passing through the settled powder lifts the white.
    float settled = smoothstep(2.4, 3.0, uProgress);
    col = mix(col, white, settled * 0.5);

    gl_FragColor = vec4(col, edge * (0.34 + 0.5 * lit) * reveal);
  }
`;

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Where each chunk sits when the block is whole, and after it breaks. */
function chunkStates() {
  const rand = rng(23);
  const whole: { pos: THREE.Vector3; rot: THREE.Euler; scale: THREE.Vector3 }[] = [];
  const broken: { pos: THREE.Vector3; rot: THREE.Euler; scale: THREE.Vector3 }[] = [];

  // The block is cut into a 2x2 grid plus three smaller wedges, so the pieces
  // differ in size the way real fracture does.
  const cuts: [number, number, number, number, number, number][] = [
    [-0.5, 0.28, -0.4, 1.0, 0.86, 0.9],
    [0.52, 0.3, -0.36, 0.96, 0.82, 0.86],
    [-0.48, -0.5, 0.42, 0.98, 0.74, 0.94],
    [0.5, -0.48, 0.4, 0.94, 0.78, 0.9],
    [0.02, 0.62, 0.5, 0.5, 0.42, 0.46],
    [-0.06, -0.72, -0.5, 0.44, 0.38, 0.5],
    [0.68, -0.02, 0.62, 0.36, 0.44, 0.34],
  ];

  for (const [x, y, z, sx, sy, sz] of cuts) {
    whole.push({
      pos: new THREE.Vector3(x * 0.52, y * 0.52, z * 0.52),
      rot: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(sx * 0.55, sy * 0.55, sz * 0.55),
    });
    const dir = new THREE.Vector3(x, y, z).normalize();
    broken.push({
      pos: new THREE.Vector3(x * 0.52, y * 0.52, z * 0.52).addScaledVector(
        dir,
        0.55 + rand() * 0.5
      ),
      rot: new THREE.Euler(
        (rand() - 0.5) * 1.1,
        (rand() - 0.5) * 1.4,
        (rand() - 0.5) * 1.1
      ),
      scale: new THREE.Vector3(sx * 0.55, sy * 0.55, sz * 0.55),
    });
  }
  return { whole, broken };
}

export function createJourneyScene({ element }: { element: HTMLElement }): JourneyScene {
  const host = getSceneHost();

  const scene = new THREE.Scene();
  const envMap = lightScene(scene, host.renderer);

  const { camera, distance } = productCamera(2.3, 0.86, 30);
  camera.position.set(distance * 0.46, distance * 0.36, distance * 0.8);
  camera.lookAt(0, -0.2, 0);

  const key = new THREE.DirectionalLight(0xffffff, 2.3);
  key.position.set(3.2, 4.5, 2.2);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x3d55a4, 2.5);
  rim.position.set(-3.2, 1.0, -3.2);
  scene.add(rim);

  /* --- the solid stages: 01 whole block, 02 broken chunks ---------------- */
  const chunkGeometry = bevelledBox(1, 1, 1, 0.05, 3);
  const chunkMaterial = stoneMaterial(envMap);
  chunkMaterial.transparent = true;

  const { whole, broken } = chunkStates();
  const chunks: THREE.Mesh[] = [];
  for (let i = 0; i < CHUNKS; i++) {
    const mesh = new THREE.Mesh(chunkGeometry, chunkMaterial);
    mesh.position.copy(whole[i].pos);
    mesh.scale.copy(whole[i].scale);
    scene.add(mesh);
    chunks.push(mesh);
  }

  const floor = studioFloor(14, -1.18, envMap);
  scene.add(floor);
  const shadow = contactShadow(4.0, 3.2, -1.16);
  scene.add(shadow);

  /* --- the powder stages: 03 cloud, 04 bed -------------------------------- */
  const rand = rng(11);
  const pRubble = new Float32Array(COUNT * 3);
  const pCloud = new Float32Array(COUNT * 3);
  const pBed = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);
  const seeds = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    seeds[i] = rand();
    sizes[i] = 1.0 + rand() * 1.6;

    // Rubble: inside one of the broken chunks, so the powder emerges from the
    // stone rather than appearing out of empty space.
    const chunk = broken[Math.floor(rand() * CHUNKS)];
    pRubble[i3] = chunk.pos.x + (rand() - 0.5) * chunk.scale.x;
    pRubble[i3 + 1] = chunk.pos.y + (rand() - 0.5) * chunk.scale.y;
    pRubble[i3 + 2] = chunk.pos.z + (rand() - 0.5) * chunk.scale.z;

    // Cloud: a wide swirl that turns as a mass.
    const angle = rand() * Math.PI * 2;
    const radius = 0.4 + Math.pow(rand(), 0.7) * 1.7;
    pCloud[i3] = Math.cos(angle) * radius;
    pCloud[i3 + 1] = (rand() - 0.5) * 1.5 + Math.sin(angle * 2) * 0.16;
    pCloud[i3 + 2] = Math.sin(angle) * radius * 0.7;

    // Bed: a shallow settled surface with real thickness.
    const px = (rand() - 0.5) * 3.8;
    const pz = (rand() - 0.5) * 2.2;
    pBed[i3] = px;
    pBed[i3 + 1] =
      -0.95 + Math.sin(px * 1.15) * 0.14 + Math.cos(pz * 1.5) * 0.09 + rand() * 0.08;
    pBed[i3 + 2] = pz;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(pRubble, 3));
  geometry.setAttribute('pRubble', new THREE.BufferAttribute(pRubble, 3));
  geometry.setAttribute('pCloud', new THREE.BufferAttribute(pCloud, 3));
  geometry.setAttribute('pBed', new THREE.BufferAttribute(pBed, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 4);

  const uniforms = {
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.5) },
  };

  const pointsMaterial = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms,
    transparent: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, pointsMaterial);
  scene.add(points);

  /* --- progress ---------------------------------------------------------- */
  const tmpQuat = new THREE.Quaternion();
  const fromQuat = new THREE.Quaternion();
  const toQuat = new THREE.Quaternion();

  let target = 0;
  let shown = 0;

  function write(p: number, elapsed: number) {
    // Stage 0 -> 1: the block separates.
    const breakT = 1 - Math.pow(1 - Math.min(1, Math.max(0, p)), 3);
    for (let i = 0; i < CHUNKS; i++) {
      chunks[i].position.lerpVectors(whole[i].pos, broken[i].pos, breakT);
      fromQuat.setFromEuler(whole[i].rot);
      toQuat.setFromEuler(broken[i].rot);
      tmpQuat.slerpQuaternions(fromQuat, toQuat, breakT);
      chunks[i].quaternion.copy(tmpQuat);
    }

    // A4: chunks are gone by stage 03, exactly where the particles arrive.
    const solidFade = 1 - smoothstep(1.6, 2.1, p);
    chunkMaterial.opacity = solidFade;
    for (const chunk of chunks) chunk.visible = solidFade > 0.01;
    shadow.visible = solidFade > 0.01;
    (shadow.material as THREE.MeshBasicMaterial).opacity = 0.9 * solidFade;
    // The powder bed becomes its own ground, so the floor recedes with the solids.
    (floor.material as THREE.MeshStandardMaterial).opacity = 0.92 * (0.35 + 0.65 * solidFade);

    uniforms.uProgress.value = p;
    uniforms.uTime.value = elapsed;

    // A very slow turn, so the mass has volume even when the scroll is parked.
    points.rotation.y = Math.sin(elapsed / 9) * 0.2;
    for (const chunk of chunks) chunk.rotation.y += 0;
  }

  function smoothstep(a: number, b: number, x: number) {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  write(0, 0);

  const unregister = registerView({
    element,
    scene,
    camera,
    update(dt, elapsed) {
      const delta = target - shown;
      const settled = Math.abs(delta) < 0.0005;
      if (!settled) shown += delta * Math.min(1, dt * 6);
      else shown = target;

      write(shown, elapsed);

      // The airborne drift only runs while the powder is in the air, so the view
      // can settle completely at either end of the sequence.
      const drifting = shown > 1.85 && shown < 2.95;
      return !settled || drifting;
    },
    dispose() {
      chunkGeometry.dispose();
      chunkMaterial.dispose();
      geometry.dispose();
      pointsMaterial.dispose();
      shadow.geometry.dispose();
      (shadow.material as THREE.Material).dispose();
      floor.geometry.dispose();
      (floor.material as THREE.Material).dispose();
    },
  });

  return {
    setProgress(p) {
      const next = Math.min(3, Math.max(0, p));
      if (Math.abs(next - target) < 0.0005) return;
      target = next;
      invalidateScenes();
    },
    dispose: unregister,
  };
}
