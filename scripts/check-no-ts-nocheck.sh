#!/usr/bin/env bash
# Fails if `// @ts-nocheck` (or any @ts-nocheck variant) appears under
# artifacts/web/src/components/ui/. Task 3 restored strict typing on the
# shadcn UI library; this guard prevents silent regressions.
set -euo pipefail

TARGET_DIR="artifacts/web/src/components/ui"

if [ ! -d "$TARGET_DIR" ]; then
  echo "check-no-ts-nocheck: target directory '$TARGET_DIR' not found" >&2
  exit 1
fi

# -n shows line numbers, -F treats the pattern as a literal string.
# grep exits 1 when there are no matches (which is what we want -> success).
if grep -RnF -- '@ts-nocheck' "$TARGET_DIR"; then
  echo "" >&2
  echo "ERROR: '@ts-nocheck' is not allowed under $TARGET_DIR" >&2
  echo "Fix the underlying type errors instead of suppressing the checker." >&2
  exit 1
fi

echo "check-no-ts-nocheck: OK (no @ts-nocheck under $TARGET_DIR)"
