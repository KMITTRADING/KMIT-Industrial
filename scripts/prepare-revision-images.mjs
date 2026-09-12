import fs from 'node:fs/promises';
import sharp from 'sharp';
const manifest=JSON.parse(await fs.readFile(process.argv[2],'utf8'));
const thumbs=[];
for(let i=0;i<manifest.length;i++){
 const {name,path}=manifest[i];
 await sharp(path).resize(1536,1024,{fit:'cover'}).webp({quality:84,effort:6}).toFile(`public/images/${name}.webp`);
 await sharp(path).resize(800,533,{fit:'cover'}).webp({quality:82,effort:6}).toFile(`public/images/${name}-800.webp`);
 // Landscape crops retain scientific context on narrow screens.
 await sharp(path).resize(720,540,{fit:'cover',position:'centre'}).webp({quality:82,effort:6}).toFile(`public/images/${name}-mobile.webp`);
 thumbs.push({input:await sharp(path).resize(400,267).toBuffer(),left:(i%3)*400,top:Math.floor(i/3)*300});
 thumbs.push({input:Buffer.from(`<svg width="400" height="33"><rect width="400" height="33" fill="white"/><text x="10" y="22" font-family="sans-serif" font-size="15" fill="#002c79">${name}</text></svg>`),left:(i%3)*400,top:Math.floor(i/3)*300+267});
}
await sharp({create:{width:1200,height:Math.ceil(manifest.length/3)*300,channels:3,background:'#fafaf8'}}).composite(thumbs).webp({quality:90}).toFile('.sites-artifacts/image-review.webp');
console.log(`Prepared ${manifest.length} new images in three responsive variants.`);
