import * as THREE from 'three';

// Preserve the commissioned image at full quality; add only restrained camera depth.
export function mountScene(element) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const host = element.querySelector('.webgl');
  if (!host || reduced.matches || !element.dataset.image) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'low-power' }); }
  catch { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 20);
  camera.position.z = 5;
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
  host.appendChild(renderer.domElement);
  let disposed = false, visible = false, ready = false, frame = 0;
  let targetX = 0, targetY = 0, targetOffset = 0;
  let texture;
  texture = new THREE.TextureLoader().load(element.dataset.image, loaded => {
    if (disposed) { loaded.dispose(); return; }
    loaded.colorSpace = THREE.SRGBColorSpace;
    loaded.minFilter = THREE.LinearFilter;
    loaded.generateMipmaps = false;
    material.map = loaded; material.needsUpdate = true; ready = true; resize();
  }, undefined, () => dispose());
  function schedule() { if (!frame && visible && ready && !disposed && !document.hidden) frame = requestAnimationFrame(draw); }
  function draw() {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    plane.rotation.x = THREE.MathUtils.lerp(plane.rotation.x, targetX, .09);
    plane.rotation.y = THREE.MathUtils.lerp(plane.rotation.y, targetY, .09);
    plane.position.y = THREE.MathUtils.lerp(plane.position.y, targetOffset, .09);
    try { renderer.render(scene, camera); element.classList.add('webgl-ready'); }
    catch { dispose(); return; }
    if (Math.abs(plane.rotation.x-targetX) + Math.abs(plane.rotation.y-targetY) + Math.abs(plane.position.y-targetOffset) > .0002) schedule();
  }
  function resize() {
    if (disposed || !host.clientWidth || !host.clientHeight) return;
    const aspect = host.clientWidth / host.clientHeight;
    camera.aspect = aspect; camera.updateProjectionMatrix();
    renderer.setSize(host.clientWidth, host.clientHeight, false);
    const imageAspect = texture?.image ? texture.image.width / texture.image.height : 1.5;
    const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov/2)) * camera.position.z;
    const coverHeight = Math.max(height, height * aspect / imageAspect) * 1.065;
    plane.scale.set(coverHeight * imageAspect, coverHeight, 1); schedule();
  }
  function pointer(event) {
    const rect = element.getBoundingClientRect();
    targetX = ((event.clientY-rect.top)/rect.height-.5) * .018;
    targetY = ((event.clientX-rect.left)/rect.width-.5) * .024; schedule();
  }
  function resetPointer() { targetX = 0; targetY = 0; schedule(); }
  function scroll() {
    if (!visible) return;
    const rect = element.getBoundingClientRect();
    targetOffset = THREE.MathUtils.clamp((innerHeight/2-rect.top-rect.height/2)/innerHeight, -.5, .5) * .09; schedule();
  }
  function preference() { if (reduced.matches || innerWidth < 900) dispose(); }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
  const visibilityObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) { scroll(); schedule(); }
    else if (frame) { cancelAnimationFrame(frame); frame = 0; }
  });
  visibilityObserver.observe(element);
  element.addEventListener('pointermove', pointer, { passive: true });
  element.addEventListener('pointerleave', resetPointer);
  window.addEventListener('scroll', scroll, { passive: true });
  window.addEventListener('resize', preference);
  reduced.addEventListener('change', preference);
  document.addEventListener('visibilitychange', schedule);
  renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); dispose(); });
  window.addEventListener('pagehide', dispose, { once: true });
  function dispose() {
    if (disposed) return;
    disposed = true; cancelAnimationFrame(frame); element.classList.remove('webgl-ready');
    resizeObserver.disconnect(); visibilityObserver.disconnect();
    element.removeEventListener('pointermove', pointer); element.removeEventListener('pointerleave', resetPointer);
    window.removeEventListener('scroll', scroll); window.removeEventListener('resize', preference);
    reduced.removeEventListener('change', preference); document.removeEventListener('visibilitychange', schedule);
    window.removeEventListener('pagehide', dispose);
    geometry.dispose(); material.dispose(); texture?.dispose(); renderer.dispose(); renderer.domElement.remove();
  }
}
