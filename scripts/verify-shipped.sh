#!/usr/bin/env bash
# Is the work actually shipped? Not "does the code exist" — could a user meet it.
#
# Every check must be able to FAIL. The first version of this script printed a
# warning and then passed anyway on checks 1 and 3, hardcoded a pass on check 4,
# and used a regex on check 2 that never matched Supabase's output. It reported
# "ALL SHIPPING CHECKS PASSED" while nothing was pushed, one migration was
# unapplied and the deploy was stale.
set -uo pipefail
FAIL=0
note() { printf '  %s\n' "$1"; }
bad()  { printf '\033[31mFAIL\033[0m  %s\n' "$1"; FAIL=1; }
ok()   { printf '\033[32m ok \033[0m  %s\n' "$1"; }

# 1 — pushed
git fetch -q origin main 2>/dev/null || true
L=$(git rev-parse HEAD 2>/dev/null || echo none)
R=$(git rev-parse origin/main 2>/dev/null || echo none)
if [ "$L" != "$R" ]; then
  bad "committed but not pushed"; note "HEAD ${L:0:7}  origin/main ${R:0:7}"
else ok "pushed (${L:0:7})"; fi

# 2 — migrations applied. Supabase prints "  0008  |        | ...", so a row with
# a local version and blank remote is an unapplied migration.
if command -v npx >/dev/null 2>&1; then
  UN=$(npx supabase migration list --linked 2>/dev/null \
       | awk -F'|' 'NF>=2 {gsub(/ /,"",$1); gsub(/ /,"",$2);
                           if ($1 ~ /^[0-9]+$/ && $2 == "") print $1}')
  if [ -n "$UN" ]; then bad "migrations written but not applied:"; note "$UN"
  else ok "migrations applied"; fi
fi

# 3 — deployed. Compare the entry bundle the live site references against the
# one a fresh build produced.
LIVE=$(curl -s --max-time 30 https://overland-ochre.vercel.app/ \
       | grep -o 'assets/index-[A-Za-z0-9_-]*\.js' | head -1 | sed 's|assets/||')
if [ -z "$LIVE" ]; then bad "could not read the live site"
elif [ ! -f "dist/assets/$LIVE" ]; then
  bad "built but not deployed"
  note "live serves $LIVE, which is not in dist/ — run npm run build, then vercel --prod"
else ok "deployed ($LIVE)"; fi

# 4 — every edge function in the repo is deployed
if [ -d supabase/functions ]; then
  ACTIVE=$(npx supabase functions list 2>/dev/null || echo "")
  for d in supabase/functions/*/; do
    n=$(basename "$d")
    if echo "$ACTIVE" | grep -q "| $n *|"; then ok "function $n deployed"
    else bad "function $n written but not deployed"; fi
  done
fi

echo
if [ "$FAIL" -ne 0 ]; then echo "NOT SHIPPED — fix the above before reporting done."; exit 1; fi
echo "Shipped."
