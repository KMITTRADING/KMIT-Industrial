'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createMetricsCache, documentTop, onScroll, progress } from '@/lib/scrollDriver';
import { BANDS, SEAM_COLOR, TOTAL_HEIGHT } from './coreSampleModel';

/**
 * Normalised world height of the core. Deliberately taller than the camera can
 * frame: the brief wants it cropped top and bottom by the viewport so it reads
 * as continuing beyond frame, the way a core does coming out of the ground.
 */
const CORE_HEIGHT = 19;
const RADIUS = 0.82;

/**
 * One object, one canvas, two sections.
 *
 * The canvas is fixed to the viewport rather than living inside either section,
 * which is what lets the same object travel from the hero to the signature
 * scroll without a second WebGL context. Sections that should not show it are
 * opaque and sit above it.
 *
 * Studio lighting only: hemisphere, key, fill, rim. No shadow maps, no bloom,
 * no particles, no post-processing. The object has to look like a core sample
 * an exploration team pulled out of the ground, not a prop.
 */
export default function CoreSample({ heroId, strataId }: { heroId: string; strataId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearAlpha(0);
    /* No tone mapping. ACES is an HDR film curve: it desaturated #2B3073 and
       #3D55A4 into slate and periwinkle, and the brand colours are the whole
       point of the ramp. Linear output renders the authored hex values. */
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 19);

    /* Clean studio lighting, and restrained. The first pass was roughly three
       times this bright, which blew the limestone to paper white and flattened
       the ramp into one pale column — the colours are the argument, so the
       lighting exists to show them, not to look impressive. */
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb9becf, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(4, 3, 6);
    const fill = new THREE.DirectionalLight(0xffffff, 0.4);
    fill.position.set(-5, 0, 4);
    const rim = new THREE.DirectionalLight(0xdfe4f2, 0.55);
    rim.position.set(-3, 2, -6);
    scene.add(key, fill, rim);

    /* ---- The core -------------------------------------------------------
       One shared cylinder geometry, instanced per band with a scaled height.
       Fourteen meshes and thirteen seam rings, not twenty-seven geometries. */
    const core = new THREE.Group();
    const bandGeometry = new THREE.CylinderGeometry(RADIUS, RADIUS, 1, 72, 1);
    const seamGeometry = new THREE.CylinderGeometry(RADIUS * 1.012, RADIUS * 1.012, 1, 72, 1);
    const seamMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(SEAM_COLOR),
      roughness: 0.9,
      metalness: 0,
    });

    const bandMeshes: THREE.Mesh[] = [];
    const materials: THREE.Material[] = [seamMaterial];
    const scale = CORE_HEIGHT / TOTAL_HEIGHT;

    let cursor = -CORE_HEIGHT / 2;
    BANDS.forEach((band, i) => {
      const height = band.height * scale;
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(band.color),
        roughness: band.roughness,
        metalness: band.metalness,
      });
      materials.push(material);

      const mesh = new THREE.Mesh(bandGeometry, material);
      mesh.scale.y = height;
      mesh.position.y = cursor + height / 2;
      mesh.userData.restY = mesh.position.y;
      core.add(mesh);
      bandMeshes.push(mesh);

      if (i > 0) {
        const seam = new THREE.Mesh(seamGeometry, seamMaterial);
        seam.scale.y = CORE_HEIGHT * 0.004;
        seam.position.y = cursor;
        seam.userData.restY = seam.position.y;
        seam.userData.seamOf = i;
        core.add(seam);
      }
      cursor += height;
    });

    core.rotation.z = 0.05;
    scene.add(core);

    /* ---- Sizing ---------------------------------------------------------
       devicePixelRatio is capped (§9). A phone at DPR 3 would otherwise render
       nine times the pixels for a difference nobody can see on a matte cylinder. */
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      const cap = window.innerWidth < 900 ? 1.5 : 1.75;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, cap));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    /* ---- Loop -----------------------------------------------------------
       Paused whenever neither host section is on screen, and on tab blur. A
       render loop spinning behind a section the reader has already left is
       pure battery cost. */
    let frame = 0;
    let running = false;
    let visible = false;
    let heroP = 0;
    let strataP = 0;
    let separation = 0;
    let spin = 0;
    let last = performance.now();

    const rtl = document.documentElement.dir === 'rtl';
    // The object sits on the trailing side, which is the left in Arabic.
    const restX = (rtl ? -1 : 1) * 4.6;

    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Slow continuous rotation. Nothing else moves in the hero.
      spin += dt * 0.06;
      core.rotation.y = spin;

      // The bands pull apart as the signature section is read, the camera
      // rises up the core, and the object eases to centre.
      separation += (strataP - separation) * Math.min(1, dt * 4);
      const centre = (BANDS.length - 1) / 2;
      for (const mesh of core.children as THREE.Mesh[]) {
        const index = mesh.userData.seamOf ?? bandMeshes.indexOf(mesh);
        const offset = (index - centre) * 0.34 * separation;
        mesh.position.y = mesh.userData.restY + offset;
      }

      // Eases toward the centre of the trailing column, not the centre of the
      // viewport — the latter walks the object straight into the text.
      core.position.x = restX * (1 - separation * 0.45);
      camera.position.y = -0.8 + separation * 4.2 + heroP * 0.8;
      camera.lookAt(0, camera.position.y * 0.35, 0);

      renderer.render(scene, camera);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(render);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
    };

    const sync = () => (visible && !document.hidden ? start() : stop());

    /* ---- Wiring ---------------------------------------------------------- */
    const hero = document.getElementById(heroId);
    const strata = document.getElementById(strataId);
    const track = document.querySelector<HTMLElement>('[data-strata-track]');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === hero) canvas.dataset.heroVisible = String(entry.isIntersecting);
          if (entry.target === strata) canvas.dataset.strataVisible = String(entry.isIntersecting);
        }
        visible =
          canvas.dataset.heroVisible === 'true' || canvas.dataset.strataVisible === 'true';
        canvas.dataset.shown = String(visible);
        sync();
      },
      { threshold: 0 },
    );
    if (hero) observer.observe(hero);
    if (strata) observer.observe(strata);

    // Same thresholds the MotionLayer uses, from the same document-absolute
    // measurements, so the bands separate in step with the text.
    const metrics = createMetricsCache(() => ({
      heroHeight: hero?.offsetHeight ?? 1,
      trackTop: track ? documentTop(track) : 0,
      trackHeight: track?.offsetHeight ?? 0,
    }));

    const unsubscribe = onScroll(({ scrollY, viewportHeight }) => {
      const m = metrics(viewportHeight);
      heroP = progress(scrollY, 0, m.heroHeight);
      if (track) {
        strataP = progress(
          scrollY,
          m.trackTop - viewportHeight * 0.1,
          m.trackTop + m.trackHeight - viewportHeight,
        );
      }
    });

    const onVisibility = () => sync();
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', resize);

    /* A lost context is not an error to swallow: stop the loop and reveal the
       CSS fallback underneath, which is already in the markup. */
    const onLost = (event: Event) => {
      event.preventDefault();
      stop();
      canvas.dataset.shown = 'false';
      // Give the CSS column back immediately: a lost context must degrade to
      // the fallback, not to empty space.
      delete document.documentElement.dataset.core;
    };
    const onRestored = () => {
      document.documentElement.dataset.core = 'webgl';
      resize();
      sync();
    };
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    // The CSS strata columns are in the markup for everyone; once the real
    // object is running they would double-draw over it, so the document
    // declares which one is authoritative and CSS hides the other.
    document.documentElement.dataset.core = 'webgl';

    resize();
    renderer.render(scene, camera);

    return () => {
      // Hand the fallback back before tearing down, so there is never a frame
      // with neither renderer visible.
      delete document.documentElement.dataset.core;
      stop();
      observer.disconnect();
      unsubscribe();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      bandGeometry.dispose();
      seamGeometry.dispose();
      for (const material of materials) material.dispose();
      renderer.dispose();
    };
  }, [heroId, strataId]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-core-canvas
      className="pointer-events-none fixed inset-0 z-[1] size-full opacity-0 transition-opacity duration-700 ease-[var(--ease-micro)] data-[shown=true]:opacity-100"
    />
  );
}
