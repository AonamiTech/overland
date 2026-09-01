import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Task 7 Accessibility Audit', () => {
  it('AuthDialog has dialog role, aria-modal, and title labelling', () => {
    const code = fs.readFileSync(path.resolve(process.cwd(), 'src/components/overland/AuthDialog.tsx'), 'utf8');

    expect(code).toMatch(/role="dialog"/i);
    expect(code).toMatch(/aria-modal="true"/i);
    expect(code).toMatch(/aria-labelledby="auth-dialog-title"/i);
    expect(code).toMatch(/id="auth-dialog-title"/i);
  });

  it('PostListing has dialog role, aria-modal, and title labelling', () => {
    const code = fs.readFileSync(path.resolve(process.cwd(), 'src/components/overland/PostListing.tsx'), 'utf8');

    expect(code).toMatch(/role="dialog"/i);
    expect(code).toMatch(/aria-modal="true"/i);
    expect(code).toMatch(/aria-labelledby="post-listing-title"/i);
    expect(code).toMatch(/id="post-listing-title"/i);
  });
});
