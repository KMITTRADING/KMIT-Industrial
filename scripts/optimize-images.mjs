import fs from 'node:fs/promises';
import sharp from 'sharp';
const input=process.argv[2];if(!input)throw Error('Pass the generated assets directory');
const map={'home-limestone':'home-hero','calcium-hero':'calcium-hero','powder-study':'material','processing-journey':'journey','industrial-solutions':'industrial','mining-strata':'mining','solar-thermal':'solar','consultation-still-life':'consultation'};
await fs.mkdir('public/images',{recursive:true});
for(const [from,to] of Object.entries(map)){const source=`${input}/${from}.png`;await sharp(source).resize(1536,1024).webp({quality:83,effort:6}).toFile(`public/images/${to}.webp`);await sharp(source).resize(800,533).webp({quality:80,effort:6}).toFile(`public/images/${to}-800.webp`);await sharp(source).resize(to==='journey'?720:640,to==='journey'?480:640,{fit:'cover',position:'centre'}).webp({quality:82,effort:6}).toFile(`public/images/${to}-mobile.webp`)}
await fs.copyFile(`${input}/prompts.json`,'docs/image-prompts.json');console.log('Optimized eight assets into 24 responsive WebP files.');
