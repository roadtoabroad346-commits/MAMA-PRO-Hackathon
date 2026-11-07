import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
const css=await fs.readFile('src/styles.css','utf8');
const luminance=hex=>{const rgb=hex.match(/[a-f0-9]{2}/ig).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
const pairs=[['text','#203431','#faf8f3'],['secondary','#53645f','#eef5f1'],['primary','#176b62','#eef5f1'],['primary button','#ffffff','#176b62'],['error','#b42318','#fff0ed'],['warning','#805500','#fff3cd'],['focus','#145ea8','#ffffff'],['border','#7a8984','#faf8f3']];
const contrast=pairs.map(([role,fg,bg])=>({role,fg,bg,ratio:Math.round((Math.max(luminance(fg),luminance(bg))+.05)/(Math.min(luminance(fg),luminance(bg))+.05)*100)/100}));
async function files(dir){let r=[];for(const x of await fs.readdir(dir,{withFileTypes:true})){const p=dir+'/'+x.name;r.push(...(x.isDirectory()?await files(p):[p]));}return r;}
const source=[...await files('src'),'index.html','package.json','package-lock.json','vite.config.ts','tsconfig.json'].sort();
const hashes=[];const findings=[];
for(const p of source){const content=await fs.readFile(p);hashes.push(`${createHash('sha256').update(content).digest('hex')}  ${p}`);
 if(/(?:sk-proj-|ghp_|github_pat_|AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/.test(content.toString()))findings.push(p);
}
await fs.writeFile('work/qa/source.sha256',hashes.join('\n')+'\n');
const bundle=await files('dist');const sizes=[];for(const p of bundle){const b=await fs.readFile(p);sizes.push({file:p,bytes:b.length,gzip:gzipSync(b).length,sha256:createHash('sha256').update(b).digest('hex')});}
const catalog=JSON.parse(await fs.readFile('src/data/catalog.json','utf8'));
console.log(JSON.stringify({catalogVersion:catalog.catalogVersion,rulesVersion:catalog.rulesVersion,demoClock:catalog.demoClock,sourceSetSha256:createHash('sha256').update(hashes.join('\n')+'\n').digest('hex'),contrast,secretPatternFiles:findings,bundle:sizes,safeArea:{footer:css.includes('env(safe-area-inset-bottom)'),viewport:await fs.readFile('index.html','utf8')}},null,2));
