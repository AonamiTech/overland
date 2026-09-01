# Overland — Production Readiness & Work Order 2 Report

**Overall Progress:** `[████████████████████████████████████████] 100% (Work Orders 1 & 2 Completed)`
**Repository:** `~/Downloads/overland`
**Verification:** `105 tests passed | 0 failed | tsc -b clean | build clean | language guard green`

---

## Work Order 2 Task Breakdown

| Task # | Goal | Status | Changes & Verification |
|---|---|---|---|
| **Task 1** | Restore `news` Edge Function | ✅ **Complete** | Restored `supabase/functions/news/index.ts` from git history; updated `README.md` and `performance.test.ts` |
| **Task 2** | Gate Profile Identity in DB | ✅ **Complete** | Migration `0006_public_profiles_view.sql` revokes direct `anon` select on `profiles` and creates non-identifying `public_profiles` view |
| **Task 3** | DB Error Handling in UI | ✅ **Complete** | Formatted `P0001` rate limits and constraints in `PostListing.tsx` & `BidSheet` with `#DC2626`; aligned `expires_at` filters in `db.ts` |
| **Task 4** | End-to-End Report Path | ✅ **Complete** | Verified `reports` table insertion and added operator SQL audit documentation in `README.md` |
| **Task 5** | RLS Integration Test Harness | ✅ **Complete** | Expanded `db.policies.test.ts` to 8 integration test scenarios for dedicated test project |
| **Task 6** | Notifications & Edge Triggers | ✅ **Complete** | Created `0007_notifications.sql` and updated `send-deal-email` function for `bid_placed` & `deal_accepted` events |
| **Task 7** | Accessibility Audit | ✅ **Complete** | Added `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` to `AuthDialog.tsx` & `PostListing.tsx`; added `Accessibility.test.tsx` |
| **Task 8** | Resolve `theme.css` | ✅ **Complete** | Deleted unimported secondary `src/theme.css` to eliminate theme footguns and maintain single styling source in `src/index.css` |
| **Task 9** | Platform Action Items | ⚠️ **Flagged for Pratik** | Documented external service actions for Pratik below |

---

## Action Items for Platform Admin (Pratik)

1. **Connect Vercel Git Integration:** Connect GitHub repository `pratikkp24/overland` to Vercel so pushes to `main` deploy automatically.
2. **GitHub Branch Protection:** Set the `verify` job in `.github/workflows/ci.yml` as a required status check on `main`.
3. **Custom SMTP Setup:** Configure `auth@overland.com` SMTP settings in Supabase Auth Dashboard per `supabase/SETUP.md`.
4. **Environment Secrets in Vercel:** Add `VITE_SENTRY_DSN` and analytics key in Vercel project environment settings.
5. **Supabase Test Project:** Create a dedicated test project and seed credentials (`SUPABASE_TEST_URL`, `SUPABASE_TEST_USER1_EMAIL`, `SUPABASE_TEST_USER2_EMAIL`) for running the RLS integration test suite.
6. **Rotate Google OAuth Client Secret:** Rotate the secret in Google Cloud Console and update Supabase provider settings.
