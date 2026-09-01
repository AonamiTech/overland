import fs from 'fs';
import path from 'path';

function fixDir(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      fixDir(full);
    } else if (/\.(tsx?|css)$/.test(f)) {
      const content = fs.readFileSync(full, 'utf8');
      const updated = content.replace(
        /color:\s*(["']?)rgba\(\s*17\s*,\s*17\s*,\s*17\s*,\s*(0?\.(?:[0-5]\d?|60|61))\s*\)\1/g,
        'color: $1rgba(17,17,17,.65)$1'
      );
      if (content !== updated) {
        fs.writeFileSync(full, updated);
        console.log('Updated text contrast in:', path.relative(process.cwd(), full));
      }
    }
  }
}

fixDir(path.resolve(process.cwd(), 'src'));
