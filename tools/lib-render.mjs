import { chromium } from 'playwright';
import { CSS } from './render.mjs';
let B;
export const browser = async () => (B ||= await chromium.launch());
export const close = async () => { if (B) await B.close(); B = null; };
export const html = (title, body, css = '', pageCss = '') => `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${title}</title><style>${CSS}${pageCss}${css}</style></head><body>${body}</body></html>`;
export async function pdf(doc, file, w = '210mm', h = '297mm') {
  const p = await (await browser()).newPage();
  await p.setContent(doc, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: file, width: w, height: h, printBackground: true, preferCSSPageSize: true });
  await p.close();
}
export async function png(doc, file, w, h, scale = 1, sel) {
  const p = await (await browser()).newPage({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  await p.setContent(doc, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
  if (sel) await (await p.$(sel)).screenshot({ path: file }); else await p.screenshot({ path: file });
  await p.close();
}
