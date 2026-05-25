#!/bin/bash
# Runs automatically after a task is merged into main.
# Must be idempotent and non-interactive. Keep it fast and minimal —
# do not run database migrations here (they are an explicit operator
# action per AGENTS.md and can hang on locks / fail under non-interactive
# stdin, breaking every subsequent merge).
set -e

echo "[post-merge] Installing dependencies..."
pnpm install --prefer-offline --reporter=silent

echo "[post-merge] Done."
