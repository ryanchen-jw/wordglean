// 一次性探測：各瀏覽器／headless 模式下 WebGPU adapter 是否可用（決定量測能否走 WebGPU 路徑）
import { chromium, webkit } from '@playwright/test';

const probe = () => (async () => {
  if (!navigator.gpu) return 'no navigator.gpu';
  const a = await navigator.gpu.requestAdapter();
  return a ? `adapter ok: ${a.info?.vendor || ''} ${a.info?.architecture || ''}` : 'requestAdapter() = null';
})();

for (const [name, type, opts] of [
  ['chromium headless-shell', chromium, { args: ['--enable-unsafe-webgpu'] }],
  ['chromium new-headless', chromium, { channel: 'chromium', args: ['--enable-unsafe-webgpu'] }],
  ['webkit', webkit, {}],
]) {
  const b = await type.launch(opts).catch((e) => ({ err: e.message.split('\n')[0] }));
  if (b.err) { console.log(name, 'launch failed:', b.err); continue; }
  const p = await b.newPage();
  await p.goto('https://example.com');
  console.log(name, '→', await p.evaluate(probe).catch((e) => 'eval error ' + e.message));
  await b.close();
}
