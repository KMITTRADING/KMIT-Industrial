import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {routes,pages} from '../src/content.mjs';
const titles=new Set(),descriptions=new Set();let links=0,images=0;
for(const lang of ['en','ar'])for(const slug of routes){const name=`${lang}/${slug}`,html=fs.readFileSync(path.join('dist',lang,slug,'index.html'),'utf8');assert.equal((html.match(/<h1>/g)||[]).length,1,`${name}: one H1`);assert(html.includes(`lang="${lang}" dir="${lang==='ar'?'rtl':'ltr'}"`));assert(!/<form\b|<input\b|\[Company Name\]|lorem ipsum/i.test(html));const title=html.match(/<title>(.*?)<\/title>/)[1],desc=html.match(/name="description" content="([^"]+)"/)[1];assert(!titles.has(title),`${name}: unique title`);assert(!descriptions.has(desc),`${name}: unique description`);titles.add(title);descriptions.add(desc);assert(html.includes('hreflang="en"')&&html.includes('hreflang="ar"')&&html.includes('hreflang="x-default"'));assert(html.includes('rel="canonical"'));const json=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert(json['@graph'].some(x=>x['@type']==='BreadcrumbList'));assert(!html.includes('aggregateRating'));for(const match of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)){const local=match[1].split('#')[0];let file=path.join('dist',local);if(local.endsWith('/'))file=path.join(file,'index.html');assert(fs.existsSync(file),`${name}: missing ${local}`);links++}for(const match of html.matchAll(/<img\b[^>]+>/g)){assert(/alt="[^"]+"/.test(match[0])||(/alt=""/.test(match[0])&&/aria-hidden="true"/.test(match[0])));assert(/width="\d+"/.test(match[0])&&/height="\d+"/.test(match[0]));images++}for(const m of html.matchAll(/https:\/\/wa.me\/([^?"]+)/g))assert.equal(m[1],'966574950950');assert(pages[lang][slug]);
 const footer=html.match(/<footer[\s\S]*?<\/footer>/)[0];
 assert(!html.includes('class="section contact-block"'),`${name}: repeated contact block removed`);
 for(const icon of ['whatsapp','phone','mail','location'])assert(footer.includes(`/icons/${icon}.svg`),`${name}: supplied ${icon} icon`);
 assert(footer.includes(lang==='ar'?'جدة، المملكة العربية السعودية':'Jeddah, Saudi Arabia'));
 assert(footer.includes(lang==='ar'?'جميع الحقوق محفوظة':'All rights reserved'));
 assert(footer.includes('class="footer-credit"'));
 if(lang==='ar')assert(footer.includes('صنع باتقان بواسطة شركة كميت المتميزة التجارية'));
 assert.equal(json['@graph'].find(x=>x['@type']==='Organization').address.addressLocality,'Jeddah');
}
const sitemap=fs.readFileSync('dist/sitemap.xml','utf8');assert.equal((sitemap.match(/<url>/g)||[]).length,20);
const original=fs.readFileSync('G:/My Drive/WORK/KMIT/Industrial/brand/logo.svg');assert(original.equals(fs.readFileSync('public/logo.svg')),'Official logo unchanged');
const assets=fs.readdirSync('public/images').map(f=>({name:f,bytes:fs.statSync('public/images/'+f).size}));assert.equal(assets.length,57);assert(assets.every(x=>x.bytes<500000),'WebP image budget');
for(const lang of ['en','ar']){const heroImages=new Set();for(const slug of routes.slice(0,8)){const html=fs.readFileSync(path.join('dist',lang,slug,'index.html'),'utf8');const hero=html.match(/<div class="hero-art">[\s\S]*?<img src="([^"]+)"/)[1];assert(!heroImages.has(hero),`${lang}/${slug}: unique hero image`);heroImages.add(hero)}}
console.log(`PASS: 20 localized pages, unique heroes and SEO, language alternates, JSON-LD, ${links} local references, ${images} accessible image elements, supplied contact icons, Jeddah, footer rights/credit, sitemap, unchanged official logo, 57 optimized images.`);
console.log('Image bytes:',assets.reduce((a,b)=>a+b.bytes,0));
