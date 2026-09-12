import fs from 'node:fs/promises';
import path from 'node:path';
import {build} from 'esbuild';
import {routes,pages} from '../src/content.mjs';
import {render,origin} from '../src/render.mjs';
await fs.mkdir('dist',{recursive:true});
await fs.cp('public','dist',{recursive:true});
await fs.copyFile('src/styles.css','dist/styles.css');
await fs.mkdir('dist/fonts',{recursive:true});
for(const subset of ['latin','arabic'])await fs.copyFile(`node_modules/@fontsource-variable/alexandria/files/alexandria-${subset}-wght-normal.woff2`,`dist/fonts/alexandria-${subset}.woff2`);
await build({entryPoints:['src/client.js'],bundle:true,splitting:true,format:'esm',outdir:'dist/assets',minify:true,target:['es2022'],entryNames:'[name]',chunkNames:'[name]-[hash]',metafile:true}).then(result=>fs.writeFile('docs/bundle-report.json',JSON.stringify(result.metafile,null,2)));
for(const lang of ['en','ar'])for(const slug of routes){const dir=path.join('dist',lang,slug);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,'index.html'),render(lang,slug))}
await fs.writeFile('dist/index.html',`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=/ar/"><title>KMIT | مواد وحلول صناعية</title><link rel="canonical" href="${origin}/ar/"><link rel="alternate" hreflang="ar" href="${origin}/ar/"><link rel="alternate" hreflang="en" href="${origin}/en/"></head><body><a href="/ar/">العربية</a> | <a href="/en/">English</a></body></html>`);
await fs.writeFile('dist/404.html',`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>الصفحة غير موجودة | Page not found · KMIT</title><link rel="stylesheet" href="/styles.css"></head><body><main class="section"><a class="brand" href="/ar/"><img src="/logo.svg" width="1920" height="649" alt="KMIT Industrial Solutions"></a><p class="eyebrow">404</p><h1>الصفحة غير موجودة</h1><p lang="en" dir="ltr">The page you’re looking for could not be found.</p><div class="hero-actions"><a class="button" href="/ar/">العودة للرئيسية</a><a class="text-link" href="/en/" lang="en">English homepage</a></div></main></body></html>`);
const items=routes.flatMap(slug=>['en','ar'].map(lang=>`<url><loc>${origin}/${lang}/${slug?slug+'/':''}</loc>${['en','ar'].map(l=>`<xhtml:link rel="alternate" hreflang="${l}" href="${origin}/${l}/${slug?slug+'/':''}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${origin}/ar/${slug?slug+'/':''}"/></url>`));
await fs.writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${items.join('')}</urlset>`);
await fs.writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await fs.writeFile('dist/_headers',`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'\n/assets/*\n  Cache-Control: public, max-age=3600\n/images/*\n  Cache-Control: public, max-age=86400\n/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n`);
console.log(`Built ${routes.length*2} localized pages, root redirect, 404, sitemap and assets.`);
