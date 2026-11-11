import { defineConfig } from 'vitest/config';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), { name: 'public-shell-manifest', enforce: 'post', generateBundle(_options, bundle) {
    const assets = [...new Set(['/index.html', '/offline.html', '/icon.svg', '/manifest.webmanifest', ...Object.keys(bundle).filter(name => name.startsWith('assets/') && !name.endsWith('.map')).map(name => '/' + name)])];
    const version = createHash('sha256').update(assets.join('\n')).update(String(bundle['index.html'] && 'source' in bundle['index.html'] ? bundle['index.html'].source : '')).update(['sw.js','manifest.webmanifest','offline.html','icon.svg'].map(name => readFileSync(new URL('./public/' + name, import.meta.url), 'utf8')).join('\n')).digest('hex').slice(0, 16);
    this.emitFile({type: 'asset', fileName: 'sw.js', source: '/* build ' + version + ' */\n' + readFileSync(new URL('./public/sw.js', import.meta.url), 'utf8')});
    this.emitFile({type: 'asset', fileName: 'app-shell.json', source: JSON.stringify({version, assets})});
  } }],
  server: { proxy: { '/api/pilot': { target: 'http://127.0.0.1:8787', changeOrigin: false } } },
  test: { include: ['tests/**/*.test.ts'] },
});
