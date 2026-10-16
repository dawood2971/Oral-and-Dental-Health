import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
const FD = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../fonts');
const U = n => `data:font/ttf;base64,${fs.readFileSync(path.join(FD, n)).toString('base64')}`;
export const LOGO = `data:image/jpeg;base64,${fs.readFileSync(path.join(FD, 'letterhead.jpg')).toString('base64')}`;
export const CREDIT = 'قسم تعزيز الصحة / برنامج الصحة المدرسية والجامعية · إعداد: داود اليعقوبي، ممرض الصحة المدرسية';
export const CSS = `
@font-face{font-family:Cairo;src:url(${U('Cairo.ttf')});font-weight:200 1000}
@font-face{font-family:Tajawal;src:url(${U('Tajawal-Regular.ttf.ttf')});font-weight:400}
@font-face{font-family:Tajawal;src:url(${U('Tajawal-Bold.ttf.ttf')});font-weight:700}
@font-face{font-family:Tajawal;src:url(${U('Tajawal-ExtraBold.ttf.ttf')});font-weight:800}
@font-face{font-family:Lalezar;src:url(${U('Lalezar-Regular.ttf.ttf')})}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{font-family:Tajawal,Cairo,sans-serif;direction:rtl;color:#1d1d1f;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always;break-after:page}
.page:last-child{page-break-after:auto;break-after:auto}
svg{display:block}
`;
export async function render(html, pdfPath, pngPrefix) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await browser.close();
}
export const doc = (title, pages, extraCss = '') =>
  `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${title}</title><style>${CSS}${extraCss}</style></head><body>${pages.join('')}</body></html>`;
