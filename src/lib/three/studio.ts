import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/**
 * Shared look-development for every scene on the site (§C).
 *
 * The diagnosis was blunt and correct: the solids read as flat grey CAD blocks.
 * That is not a polygon-count problem, it is three missing things — bevelled
 * edges, an environment for PBR to reflect, and contact with a ground. This
 * module supplies all three so no scene has to reinvent them, and so they stay
 * consistent across the site.
 */

/* ========================================================== environment ===
 * C2: without an environment map, a MeshStandardMaterial has nothing to
 * reflect and every surface resolves to flat diffuse grey. That is exactly what
 * was on screen.
 *
 * A studio HDRI is generated procedurally rather than downloaded: a dark room
 * with three emissive panels, run through PMREMGenerator. It costs no request,
 * no bundle weight and no licence, and for lighting a white solid it is
 * indistinguishable from a real studio probe.
 * ========================================================================= */

let envMap: THREE.Texture | null = null;
let envRenderer: THREE.WebGLRenderer | null = null;
let software: boolean | null = null;

/**
 * True when WebGL is being rasterised on the CPU — SwiftShader, llvmpipe, or a
 * plain software fallback — rather than on a GPU.
 *
 * This matters because generating the PMREM is by far the most expensive thing
 * the 3D layer does at start-up. On a GPU it is a few milliseconds. On a
 * software rasteriser, measured here, it is a single ~2.8s block of the main
 * thread, which is most of the page's total blocking time and is what a
 * headless Lighthouse run sees. The lighting is an enhancement, not a
 * requirement — every scene also carries a key and a rim light — so on a
 * machine that cannot afford it we light with those and skip the probe.
 */
function isSoftwareRenderer(renderer: THREE.WebGLRenderer): boolean {
  if (software !== null) return software;
  software = false;
  try {
    const gl = renderer.getContext();
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const name = ext
      ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? '')
      : String(gl.getParameter(gl.RENDERER) ?? '');
    software = /swiftshader|llvmpipe|softpipe|software|basic render|microsoft basic/i.test(name);
  } catch {
    /* If the extension is blocked we assume real hardware and keep the probe. */
  }
  return software;
}

/**
 * Sets up a scene's ambient lighting and returns the environment map to build
 * materials against, which is `null` on a software rasteriser. A material with
 * a null `envMap` is still perfectly valid — it simply has nothing to reflect.
 */
export function lightScene(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer
): THREE.Texture | null {
  const env = getStudioEnvironment(renderer);
  if (env) {
    scene.environment = env;
    return env;
  }
  /* No probe: a hemisphere stands in for the room, so the shadow sides pick up
     the rim colour and the tops pick up the key instead of going dead black. */
  const hemisphere = new THREE.HemisphereLight(0xdfe4f5, 0x2b3073, 1.15);
  scene.add(hemisphere);
  return null;
}

export function getStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture | null {
  if (envRenderer === renderer && (envMap || software)) return envMap;
  if (isSoftwareRenderer(renderer)) {
    envRenderer = renderer;
    return null;
  }

  const pmrem = new THREE.PMREMGenerator(renderer);

  const room = new THREE.Scene();
  room.background = new THREE.Color(0x0d1030);

  const panel = (
    color: number,
    intensity: number,
    size: [number, number],
    position: [number, number, number],
    lookAt: [number, number, number] = [0, 0, 0]
  ) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(size[0], size[1]),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: intensity })
    );
    mesh.position.set(...position);
    mesh.lookAt(new THREE.Vector3(...lookAt));
    room.add(mesh);
  };

  // Key: a large cool-white softbox high on one side.
  panel(0xffffff, 1.0, [10, 10], [6, 8, 6]);
  // Rim: --brand-mid behind the subject, which is what draws the edges (§10).
  panel(0x3d55a4, 0.85, [12, 8], [-7, 2, -8]);
  // Fill: a dim --brand bounce from below, so shadow sides are not dead black.
  panel(0x2b3073, 0.5, [12, 6], [-3, -6, 5]);
  // Ground bounce, warm stone, keeps undersides from going blue.
  panel(0xe8e5de, 0.28, [14, 14], [0, -7, 0]);

  const target = pmrem.fromScene(room, 0.04);
  envMap = target.texture;
  envRenderer = renderer;

  room.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      (object.material as THREE.Material).dispose();
    }
  });
  pmrem.dispose();

  return envMap;
}

export function disposeStudioEnvironment() {
  envMap?.dispose();
  envMap = null;
  envRenderer = null;
}

/* ============================================================== geometry ===
 * C1: the single most valuable change. A mathematically sharp edge catches no
 * light, so it reads flat and cheap. Every solid gets a small bevel — 1.5-3% of
 * its smallest dimension — which produces the thin specular line along each
 * edge that makes an object look manufactured.
 * ========================================================================= */

/** A box with bevelled edges. `bevel` is a fraction of the smallest dimension. */
export function bevelledBox(
  width: number,
  height: number,
  depth: number,
  bevel = 0.03,
  segments = 3
): THREE.BufferGeometry {
  const smallest = Math.min(width, height, depth);
  // RoundedBoxGeometry clamps the radius at half the smallest side; stay under it.
  const radius = Math.min(smallest * bevel, smallest * 0.45);
  return new RoundedBoxGeometry(width, height, depth, segments, radius);
}

/**
 * A calcite rhombohedron with bevelled edges: a bevelled cube put through the
 * same shear as before, so the faces become rhombs meeting at oblique angles.
 * The bevel survives the shear, which is what gives it its edge highlights.
 */
export function bevelledRhombohedron(shear = 0.34, bevel = 0.028): THREE.BufferGeometry {
  const geometry = bevelledBox(1, 1, 1, bevel, 3);
  geometry.applyMatrix4(
    new THREE.Matrix4().set(1, shear, shear, 0, shear, 1, shear, 0, shear, shear, 1, 0, 0, 0, 0, 1)
  );
  geometry.computeVertexNormals();
  return geometry;
}

/* ============================================================== material ===
 * C3: one uniform roughness value reads as plastic. Real stone varies across
 * the surface, so roughness is driven by a small noise texture and a very fine
 * normal map supplies grain — grain, not carving.
 * ========================================================================= */

let noiseTextures: { roughness: THREE.Texture; normal: THREE.Texture } | null = null;

function buildNoiseTextures() {
  if (noiseTextures) return noiseTextures;

  const size = 256;

  // Roughness: smooth low-frequency variation between 0.35 and 0.6.
  const rough = document.createElement('canvas');
  rough.width = rough.height = size;
  const rctx = rough.getContext('2d')!;
  const image = rctx.createImageData(size, size);
  // Value noise: a coarse lattice smoothed by bilinear sampling reads as
  // material variation rather than the television static of per-pixel random.
  const lattice = 16;
  const grid: number[] = [];
  for (let i = 0; i < (lattice + 1) * (lattice + 1); i++) grid.push(Math.random());
  const sample = (x: number, y: number) => {
    const gx = (x / size) * lattice;
    const gy = (y / size) * lattice;
    const x0 = Math.floor(gx);
    const y0 = Math.floor(gy);
    const fx = gx - x0;
    const fy = gy - y0;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const at = (ix: number, iy: number) => grid[iy * (lattice + 1) + ix];
    const top = at(x0, y0) * (1 - sx) + at(x0 + 1, y0) * sx;
    const bottom = at(x0, y0 + 1) * (1 - sx) + at(x0 + 1, y0 + 1) * sx;
    return top * (1 - sy) + bottom * sy;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const value = sample(x, y);
      const v = Math.round((0.35 + value * 0.25) * 255);
      const i = (y * size + x) * 4;
      image.data[i] = image.data[i + 1] = image.data[i + 2] = v;
      image.data[i + 3] = 255;
    }
  }
  rctx.putImageData(image, 0, 0);

  // Normal: fine high-frequency grain, very shallow.
  const normal = document.createElement('canvas');
  normal.width = normal.height = size;
  const nctx = normal.getContext('2d')!;
  const nimg = nctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const jitter = (Math.random() - 0.5) * 26;
    const p = i * 4;
    nimg.data[p] = 128 + jitter;
    nimg.data[p + 1] = 128 + (Math.random() - 0.5) * 26;
    nimg.data[p + 2] = 255;
    nimg.data[p + 3] = 255;
  }
  nctx.putImageData(nimg, 0, 0);

  const roughnessTexture = new THREE.CanvasTexture(rough);
  roughnessTexture.wrapS = roughnessTexture.wrapT = THREE.RepeatWrapping;
  const normalTexture = new THREE.CanvasTexture(normal);
  normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
  normalTexture.repeat.set(3, 3);

  noiseTextures = { roughness: roughnessTexture, normal: normalTexture };
  return noiseTextures;
}

/** Warm stone white (#E8E5DE), varied roughness, fine grain. */
export function stoneMaterial(envMapTexture: THREE.Texture | null): THREE.MeshStandardMaterial {
  const { roughness, normal } = buildNoiseTextures();
  return new THREE.MeshStandardMaterial({
    color: 0xe8e5de,
    roughness: 0.52,
    roughnessMap: roughness,
    normalMap: normal,
    normalScale: new THREE.Vector2(0.12, 0.12),
    metalness: 0.04,
    envMap: envMapTexture,
    envMapIntensity: 0.9,
    /* Without a probe there is nothing to reflect, so the broad soft highlight
       the environment used to supply has to come from the key light instead:
       a rougher surface spreads it wide rather than leaving a hot pinpoint. */
    ...(envMapTexture ? {} : { roughness: 0.62 }),
  });
}

/** Polished marble: the same stone, smoother, for slab faces. */
export function marbleMaterial(envMapTexture: THREE.Texture | null): THREE.MeshStandardMaterial {
  const { roughness, normal } = buildNoiseTextures();
  return new THREE.MeshStandardMaterial({
    color: 0xf1efea,
    roughness: 0.28,
    roughnessMap: roughness,
    normalMap: normal,
    normalScale: new THREE.Vector2(0.06, 0.06),
    metalness: 0.05,
    envMap: envMapTexture,
    envMapIntensity: 1.15,
    ...(envMapTexture ? {} : { roughness: 0.4 }),
  });
}

/**
 * C6: a solar panel without a reflection is not a solar panel. Dark glass, low
 * roughness, high environment intensity, with a cell grid drawn into the map.
 */
let cellTexture: THREE.Texture | null = null;

export function solarMaterial(envMapTexture: THREE.Texture | null): THREE.MeshStandardMaterial {
  if (!cellTexture) {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#1d2450';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#3d55a4';
    ctx.lineWidth = 2;
    const cells = 4;
    for (let i = 0; i <= cells; i++) {
      const p = (i / cells) * size;
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, size);
      ctx.moveTo(0, p);
      ctx.lineTo(size, p);
      ctx.stroke();
    }
    cellTexture = new THREE.CanvasTexture(canvas);
    cellTexture.wrapS = cellTexture.wrapT = THREE.RepeatWrapping;
  }
  return new THREE.MeshStandardMaterial({
    color: 0x2a3268,
    map: cellTexture,
    roughness: 0.1,
    metalness: 0.1,
    envMap: envMapTexture,
    envMapIntensity: 1.6,
    /* This is the material that suffers most without a probe: dark glass at
       roughness 0.1 has nothing to reflect and resolves to a black silhouette.
       Lifting the base and roughening it trades the mirror for a sheen the key
       and rim lights can actually produce, which still reads as a panel. */
    ...(envMapTexture ? {} : { color: 0x3c4788, roughness: 0.38, metalness: 0.3 }),
  });
}

/* ======================================================= contact shadow ===
 * C4: the solids were floating in a void. A soft radial shadow plane under a
 * subject supplies weight instantly, and costs one textured quad — where a real
 * shadow map would cost a second render pass per light (B4 forbids that).
 * ========================================================================= */

let falloffTexture: THREE.Texture | null = null;

/** A radial white-to-transparent ramp, used to fade the floor's edges out. */
function getFalloffTexture(): THREE.Texture {
  if (falloffTexture) return falloffTexture;
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.45, '#d8d8d8');
  gradient.addColorStop(1, '#000000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  falloffTexture = new THREE.CanvasTexture(canvas);
  return falloffTexture;
}

let shadowTexture: THREE.Texture | null = null;

function getShadowTexture(): THREE.Texture {
  if (shadowTexture) return shadowTexture;
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(5,6,20,0.78)');
  gradient.addColorStop(0.4, 'rgba(5,6,20,0.4)');
  gradient.addColorStop(1, 'rgba(5,6,20,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  shadowTexture = new THREE.CanvasTexture(canvas);
  return shadowTexture;
}

/**
 * A studio sweep for the subject to stand on.
 *
 * A contact shadow alone does nothing on this site: the scenes sit on the deep
 * indigo section ground, and a dark shadow against a dark ground is invisible —
 * which is why the solids still looked like they were floating. A faint floor
 * one step lighter than the section gives the shadow something to fall on, and
 * gives the subject a horizon.
 */
export function studioFloor(size: number, y: number, envMapTexture: THREE.Texture | null): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshStandardMaterial({
      color: 0x232a5e,
      roughness: 0.86,
      metalness: 0.0,
      envMap: envMapTexture,
      envMapIntensity: 0.55,
      transparent: true,
      opacity: 0.92,
      // Without this the floor is a hard-edged rectangle floating in the
      // section — a radial alpha ramp dissolves it into the ground instead.
      alphaMap: getFalloffTexture(),
      depthWrite: false,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = y;
  mesh.renderOrder = -2;
  return mesh;
}

/** A soft ground shadow, lying in the XZ plane at `y`. */
export function contactShadow(width: number, depth: number, y = 0): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshBasicMaterial({
      map: getShadowTexture(),
      transparent: true,
      depthWrite: false,
      opacity: 0.9,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = y;
  mesh.renderOrder = -1;
  return mesh;
}

/**
 * C5: a product-photography lens. A narrow field of view removes the perspective
 * exaggeration that made the scenes look like toys, and `distance` is solved so
 * the subject fills the requested fraction of the frame height.
 */
export function productCamera(subjectHeight: number, fill = 0.66, fov = 30) {
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  const visibleHeight = subjectHeight / fill;
  const distance = visibleHeight / 2 / Math.tan((fov * Math.PI) / 360);
  return { camera, distance };
}

/** Frees everything this module caches. Called when the host tears down. */
export function disposeStudio() {
  disposeStudioEnvironment();
  noiseTextures?.roughness.dispose();
  noiseTextures?.normal.dispose();
  noiseTextures = null;
  cellTexture?.dispose();
  cellTexture = null;
  shadowTexture?.dispose();
  shadowTexture = null;
  falloffTexture?.dispose();
  falloffTexture = null;
}
