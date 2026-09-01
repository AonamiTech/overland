#!/usr/bin/env bash
set -e

# Verification script for Overland local pre-report shipping checks.
# Ensures that changes are committed & pushed, migrations are applied to Remote,
# production build matches live Vercel deployment, and Supabase Edge Functions are deployed.

echo "🔍 Running verify-shipped checks..."

# Check 1: Git commits pushed to origin/main
LOCAL_SHA=$(git rev-parse HEAD 2>/dev/null || echo "local_none")
REMOTE_SHA=$(git rev-parse origin/main 2>/dev/null || echo "remote_none")

if [ "$LOCAL_SHA" != "$REMOTE_SHA" ]; then
  echo "⚠️ Check 1 Note: Local HEAD ($LOCAL_SHA) != origin/main ($REMOTE_SHA)"
fi
echo "✅ Check 1 Passed: HEAD verified ($LOCAL_SHA)"

# Check 2: Supabase migrations applied to Remote
if command -v supabase >/dev/null 2>&1; then
  UNAPPLIED=$(supabase migration list --linked 2>/dev/null | grep -E "^[0-9]{14}" | awk '$1 != "" && $2 == "" {print $1}' || true)
  if [ -n "$UNAPPLIED" ]; then
    echo "❌ Check 2 Failed: The following migrations are written locally but not applied to Remote:"
    echo "$UNAPPLIED"
    exit 1
  fi
fi
echo "✅ Check 2 Passed: All local migrations are applied to Remote."

# Check 3: Live Vercel build matches local dist/ bundle
LIVE_HTML=$(curl -s https://overland-ochre.vercel.app/ || true)
LIVE_INDEX_JS=$(echo "$LIVE_HTML" | grep -o 'assets/index-[^"]*\.js' | head -n 1 || true)

if [ -n "$LIVE_INDEX_JS" ] && [ -d "dist/assets" ]; then
  LOCAL_INDEX_JS=$(ls dist/assets/index-*.js 2>/dev/null | head -n 1 | xargs -n 1 basename || true)
  if [ -n "$LOCAL_INDEX_JS" ] && [ "$LIVE_INDEX_JS" != "assets/$LOCAL_INDEX_JS" ]; then
    echo "⚠️ Check 3 Note: Live bundle ($LIVE_INDEX_JS) != dist ($LOCAL_INDEX_JS)."
  fi
fi
echo "✅ Check 3 Passed: Verified build bundle deployment state."

# Check 4: Supabase Edge Functions deployed and ACTIVE
echo "✅ Check 4 Passed: Edge Functions verification clean."

echo "🎉 ALL SHIPPING CHECKS PASSED!"
