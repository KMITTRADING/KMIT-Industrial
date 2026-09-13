const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const button=document.querySelector('.menu-toggle'),menu=document.querySelector('#mobile-nav');
function closeMenu(){button?.setAttribute('aria-expanded','false');if(menu)menu.hidden=true}
button?.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));menu.hidden=!open});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();button.focus()}});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu()});
matchMedia('(min-width: 1280px)').addEventListener('change',closeMenu);
const header=document.querySelector('.header');let scheduled=false;
window.addEventListener('scroll',()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{header.classList.toggle('scrolled',scrollY>20);scheduled=false})},{passive:true});
// Emit a local integration event and forward approved interactions to Google Analytics.
const emit=(name,detail={})=>{const context={page:document.body.dataset.page,language:document.documentElement.lang,...detail};window.dispatchEvent(new CustomEvent('kmit:analytics',{detail:{name,...context}}));window.gtag?.('event',name,context)};
document.addEventListener('click',e=>{const a=e.target.closest('[data-event]');if(a)emit(a.dataset.event)});
const engagement=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){emit('product_page_engagement',{section:e.target.id});engagement.unobserve(e.target)}},{threshold:.25});
document.querySelectorAll('#applications,#technical').forEach(e=>engagement.observe(e));
const canEnhance=()=>!reduced.matches&&!navigator.connection?.saveData&&!['slow-2g','2g','3g'].includes(navigator.connection?.effectiveType)&&(!navigator.hardwareConcurrency||navigator.hardwareConcurrency>=4)&&innerWidth>=900;
if(canEnhance()){
 const scenes=new IntersectionObserver(async entries=>{for(const entry of entries){if(entry.isIntersecting){scenes.unobserve(entry.target);try{const module=await import('./scenes.js');if(canEnhance())module.mountScene(entry.target)}catch{/* The generated image remains the accessible fallback. */}}}},{rootMargin:'150px'});
 document.querySelectorAll('[data-scene]').forEach(el=>scenes.observe(el));
}
if(document.querySelector('[data-journey]')) import('./journeys.js').then(({mountJourneys})=>mountJourneys()).catch(()=>{});
