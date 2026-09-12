import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function mountJourneys() {
  const media = gsap.matchMedia();
  media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    const cleanups = [];
    document.querySelectorAll('[data-journey]').forEach(journey => {
      const steps = [...journey.querySelectorAll('[data-step]')];
      const frames = [...journey.querySelectorAll('[data-frame]')];
      const links = [...journey.querySelectorAll('[data-stage-link]')];
      const progress = journey.querySelector('.journey-progress span');
      const readout = journey.querySelector('.journey-readout');
      const counter = journey.querySelector('.stage-counter>span');
      let current = -1;
      journey.classList.add('is-enhanced');
      function activate(index) {
        if (current === index) return;
        current = index;
        frames.forEach((frame, i) => frame.setAttribute('aria-hidden', String(i !== index)));
        steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
        links.forEach((link, i) => { if (i === index) link.setAttribute('aria-current', 'step'); else link.removeAttribute('aria-current'); });
        readout.querySelector('.num').textContent = `0${index+1} / 0${steps.length}`;
        readout.querySelector('strong').textContent = steps[index].querySelector('h3').textContent;
        counter.textContent = `0${index+1}`;
      }
      const position = { value: 0 };
      // Continuous scroll value, damped by GSAP. Keep the complete previous
      // photograph beneath the next one to prevent empty crossfade frames.
      frames.forEach((frame, i) => { frame.style.opacity = i === 0 ? '1' : '0'; frame.style.zIndex = String(i); });
      function paint() {
        const value = position.value;
        activate(Math.min(steps.length-1, Math.round(value)));
        frames.forEach((frame, i) => {
          const image = frame.querySelector('img');
          const mix = i === 0 ? 1 : gsap.utils.clamp(0, 1, (value-(i-.8))/.65);
          frame.style.opacity = image.complete && image.naturalWidth ? String(mix) : '0';
          frame.querySelector('picture').style.transform = `scale(${1.018 - Math.min(1, mix)*.018})`;
        });
        progress.style.transform = `scaleX(${(value+1)/steps.length})`;
      }
      const tween = gsap.to(position, {
        value: steps.length-1, ease: 'none',
        scrollTrigger: { trigger: steps[0], start: 'center center', endTrigger: steps.at(-1), end: 'center center', scrub: .85, invalidateOnRefresh: true },
        onUpdate: paint
      });
      const preload = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { frames.forEach(frame => { frame.querySelector('img').loading = 'eager'; }); preload.disconnect(); }
      }, { rootMargin: '500px' });
      preload.observe(journey);
      frames.forEach(frame => frame.querySelector('img').addEventListener('load', paint));
      activate(0);
      cleanups.push(() => {
        preload.disconnect(); journey.classList.remove('is-enhanced');
        frames.forEach(frame => { frame.removeAttribute('style'); frame.querySelector('picture').removeAttribute('style'); frame.querySelector('img').removeEventListener('load', paint); });
        tween.scrollTrigger?.kill(); tween.kill();
      });
    });
    return () => cleanups.forEach(cleanup => cleanup());
  });
  return () => media.revert();
}
