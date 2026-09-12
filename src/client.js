const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const button=document.querySelector('.menu-toggle'),menu=document.querySelector('#mobile-nav');
function closeMenu(){button?.setAttribute('aria-expanded','false');if(menu)menu.hidden=true}
button?.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));menu.hidden=!open});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();button.focus()}});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu()});
matchMedia('(min-width: 1051px)').addEventListener('change',closeMenu);
const header=document.querySelector('.header');let scheduled=false;
window.addEventListener('scroll',()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{header.classList.toggle('scrolled',scrollY>20);scheduled=false})},{passive:true});
// Optional first-party integration: listen for kmit:analytics. No provider or identifier is installed.
const emit=(name,detail={})=>window.dispatchEvent(new CustomEvent('kmit:analytics',{detail:{name,page:document.body.dataset.page,language:document.documentElement.lang,...detail}}));
document.addEventListener('click',e=>{const a=e.target.closest('[data-event]');if(a)emit(a.dataset.event)});
const engagement=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){emit('product_page_engagement',{section:e.target.id});engagement.unobserve(e.target)}},{threshold:.25});
document.querySelectorAll('#applications,#technical').forEach(e=>engagement.observe(e));
const canEnhance=()=>!reduced.matches&&!navigator.connection?.saveData&&!['slow-2g','2g','3g'].includes(navigator.connection?.effectiveType)&&(!navigator.hardwareConcurrency||navigator.hardwareConcurrency>=4)&&innerWidth>=850;
if(canEnhance()){
 const scenes=new IntersectionObserver(async entries=>{for(const entry of entries){if(entry.isIntersecting){scenes.unobserve(entry.target);try{const module=await import('./scenes.js');if(canEnhance())module.mountScene(entry.target)}catch{/* The generated image remains the accessible fallback. */}}}},{rootMargin:'150px'});
 document.querySelectorAll('[data-scene]').forEach(el=>scenes.observe(el));
}
if(!reduced.matches){import('gsap').then(async({gsap})=>{const {ScrollTrigger}=await import('gsap/ScrollTrigger');gsap.registerPlugin(ScrollTrigger);document.querySelectorAll('[data-journey]').forEach(j=>{const steps=[...j.querySelectorAll('[data-step]')],readout=j.querySelector('.journey-readout');steps.forEach((step,i)=>{ScrollTrigger.create({trigger:step,start:'top 65%',end:'bottom 65%',onEnter:()=>update(i),onEnterBack:()=>update(i)});function update(index){readout.querySelector('.num').textContent=`0${index+1} / 0${steps.length}`;readout.querySelector('strong').textContent=steps[index].querySelector('h3').textContent;j.dispatchEvent(new CustomEvent('journey:step',{detail:{index,progress:index/(steps.length-1)}}))}})});reduced.addEventListener('change',e=>{if(e.matches)ScrollTrigger.getAll().forEach(t=>t.kill())})}).catch(()=>{})}

