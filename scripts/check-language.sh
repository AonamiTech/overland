#!/usr/bin/env bash
set -euo pipefail

FORBIDDEN_PATTERN="commission|escrow|we vet|verified carrier|guaranteed payment|we arrange|payment protection"

MATCHES=$(grep -rnEi "${FORBIDDEN_PATTERN}" src/ --exclude="TermsPage.tsx" --exclude="LEGAL-NOTES.md" || true)

if [ -n "${MATCHES}" ]; then
  echo "❌ Forbidden language found in src/:"
  echo "${MATCHES}"
  exit 1
else
  echo "✅ Language check passed — no prohibited broker/commission/vetting claims found."
  exit 0
fi
