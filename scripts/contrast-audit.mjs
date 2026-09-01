import fs from 'fs';
import path from 'path';

/**
 * WCAG AA Contrast Audit Script for Text Elements with Alpha Compositing.
 *
 * Scans src/ directory for text color declarations using rgba(17,17,17, alpha),
 * composites alpha onto background surfaces (#FFFFFF and #FAF9F7),
 * and verifies WCAG AA compliance (ratio >= 4.5:1 for normal text).
 */

function relativeLuminance(r, g, b) {
  const [sR, sG, sB] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
}

function contrastRatio(rgb1, rgb2) {
  const l1 = relativeLuminance(...rgb1);
  const l2 = relativeLuminance(...rgb2);
  const max = Math.max(l1, l2);
  const min = Math.min(l1, l2);
  return (max + 0.05) / (min + 0.05);
}

function composite(fgRgb, alpha, bgRgb) {
  return [
    Math.round(fgRgb[0] * alpha + bgRgb[0] * (1 - alpha)),
    Math.round(fgRgb[1] * alpha + bgRgb[1] * (1 - alpha)),
    Math.round(fgRgb[2] * alpha + bgRgb[2] * (1 - alpha)),
  ];
}

const INK_RGB = [17, 17, 17];
const BG_WHITE = [255, 255, 255];
const BG_CREAM = [250, 249, 247];

let failures = 0;
let checked = 0;

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scanDir(full);
    } else if (/\.(tsx?|css)$/.test(f)) {
      const content = fs.readFileSync(full, 'utf8');
      // Match text color declarations specifically
      const matches = content.matchAll(/color:\s*['"]?rgba\(\s*17\s*,\s*17\s*,\s*17\s*,\s*([\d\.]+)\s*\)/g);
      for (const m of matches) {
        const alpha = parseFloat(m[1]);
        if (alpha < 1.0) {
          checked++;
          const compWhite = composite(INK_RGB, alpha, BG_WHITE);
          const compCream = composite(INK_RGB, alpha, BG_CREAM);
          const ratioWhite = contrastRatio(compWhite, BG_WHITE);
          const ratioCream = contrastRatio(compCream, BG_CREAM);

          if (ratioWhite < 4.5 || ratioCream < 4.5) {
            failures++;
            console.error(`❌ Text Contrast Failure in ${path.relative(process.cwd(), full)}: opacity ${alpha} (Ratio White: ${ratioWhite.toFixed(2)}:1, Cream: ${ratioCream.toFixed(2)}:1)`);
          }
        }
      }
    }
  }
}

scanDir(path.resolve(process.cwd(), 'src'));

console.log(`\nAudit Complete: Checked ${checked} text color opacity occurrences.`);
if (failures > 0) {
  console.error(`❌ Total Text Contrast Failures (< 4.5:1): ${failures}`);
  process.exit(1);
} else {
  console.log(`✅ All evaluated text contrast ratios >= 4.5:1 (0 WCAG AA Failures).`);
}
