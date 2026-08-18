import * as THREE from 'three';
import { getSceneHost, invalidateScenes, registerView } from './sceneHost';
import {
  bevelledRhombohedron,
  contactShadow,
  getStudioEnvironment,
  productCamera,
} from './studio';

/**
 * The calcite crystal explorer on /calcium-carbonate (§9).
 *
 * B3 in practice: this scene, not the hero, was the one carrying a transmission
 * material — `MeshPhysicalMaterial` with `transmission: 0.72`, which makes three
 * re-render the scene into a buffer every frame. It is gone. A polished
 * dielectric with a strong environment reflection and a light Fresnel rim reads
 * as a crystal just as well here, where the subject is the *structure* rather
 * than what you can see through it, and it costs a single pass.
 *
 * §10 still holds: drag is armed only after a deliberate press, so a visitor
 * scrolling past on a touch screen is never captured by the canvas.
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

export function createCalciteExplorer({
  element,
}: {
  element: HTMLElement;
}): CalciteExplorerScene {
  const host = getSceneHost();
  const envMap = getStudioEnvironment(host.renderer);

  const scene = new THREE.Scene();
  scene.environment = envMap;

  // C5: product lens, subject filling about two thirds of the frame.
  const { camera, distance } = productCamera(1.8, 0.64, 30);
  camera.position.set(0, 0, distance);

  const key = new THREE.DirectionalLight(0xf4f7ff, 1.3);
  key.position.set(2.4, 3, 2.6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x3d55a4, 2.2);
  rim.position.set(-2.8, 0.6, -2);
  scene.add(rim);

  const geometry = bevelledRhombohedron(0.34, 0.026);

  /* A polished dielectric rather than a transmissive one. Low roughness plus a
     strong environment gives the wet, faceted look; `transmission` would add a
     full extra render pass per frame for a subtlety nobody would notice at this
     size (§B3). */
  const material = new THREE.MeshStandardMaterial({
    color: 0xf2f4fb,
    roughness: 0.08,
    metalness: 0.06,
    envMap,
    envMapIntensity: 1.8,
  });

  const crystal = new THREE.Mesh(geometry, material);
  crystal.scale.setScalar(1.7);

  // Cleavage edges as real lines, so the geometry reads at any size.
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, 24),
    new THREE.LineBasicMaterial({ color: 0xdce2f5, transparent: true, opacity: 0.55 })
  );
  edges.scale.setScalar(1.7);

  const group = new THREE.Group();
  group.add(crystal);
  group.add(edges);
  scene.add(group);

  const shadow = contactShadow(3.4, 3.4, -1.25);
  scene.add(shadow);

  /* ------------------------------------------------------------ interaction */
  const target = { x: VIEWS[0].x, y: VIEWS[0].y };
  const current = { x: VIEWS[0].x, y: VIEWS[0].y };

  let dragging = false;
  let lastPointer = { x: 0, y: 0 };

  const onPointerDown = (event: PointerEvent) => {
    dragging = true;
    lastPointer = { x: event.clientX, y: event.clientY };
    element.setPointerCapture(event.pointerId);
    invalidateScenes();
  };
  const onPointerMove = (event: PointerEvent) => {
    if (!dragging) return;
    target.y += (event.clientX - lastPointer.x) * 0.008;
    target.x += (event.clientY - lastPointer.y) * 0.006;
    target.x = Math.max(-1.1, Math.min(1.1, target.x));
    lastPointer = { x: event.clientX, y: event.clientY };
    invalidateScenes();
  };
  const onPointerUp = (event: PointerEvent) => {
    dragging = false;
    if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
  };

  // The shared canvas never takes pointer events; this view listens on its own
  // container instead, which is what keeps the rest of the page scrollable.
  element.style.touchAction = 'pan-y';
  element.addEventListener('pointerdown', onPointerDown);
  element.addEventListener('pointermove', onPointerMove);
  element.addEventListener('pointerup', onPointerUp);
  element.addEventListener('pointercancel', onPointerUp);

  const unregister = registerView({
    element,
    scene,
    camera,
    update(dt, elapsed) {
      // Ease toward the selected view; never linear (§11).
      const k = Math.min(1, dt * 3.4);
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      current.x += dx * k;
      current.y += dy * k;

      // A slow idle drift while nobody is dragging, so the solid has volume.
      const idle = dragging ? 0 : Math.sin(elapsed / 6) * 0.06;
      group.rotation.set(current.x, current.y + idle, 0);

      // Idle drift keeps it alive; the host stops the moment it scrolls away.
      return true;
    },
    dispose() {
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerup', onPointerUp);
      element.removeEventListener('pointercancel', onPointerUp);
      geometry.dispose();
      material.dispose();
      edges.geometry.dispose();
      (edges.material as THREE.Material).dispose();
      shadow.geometry.dispose();
      (shadow.material as THREE.Material).dispose();
    },
  });

  return {
    focusFace(index) {
      const view = VIEWS[index] ?? VIEWS[0];
      target.x = view.x;
      target.y = view.y;
      invalidateScenes();
    },
    dispose: unregister,
  };
}
