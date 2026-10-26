#!/usr/bin/env bash
# Links the scramble-numbers command into ~/.local/bin (macOS, Linux, WSL)
set -euo pipefail

ROOT="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="${SCRAMBLE_NUMBERS_BIN_DIR:-$HOME/.local/bin}"
TARGET="$BIN_DIR/scramble-numbers"

info() { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33mwarn:\033[0m %s\n' "$*" >&2; }
die() { printf '\033[1;31merror:\033[0m %s\n' "$*" >&2; exit 1; }

command -v node >/dev/null || die "Node.js not found, install Node.js 20 or newer first"
major="$(node -p 'process.versions.node.split(".")[0]')"
(( major >= 20 )) || die "Node.js $(node --version) is too old, 20 or newer is needed"

chmod +x "$ROOT/bin/scramble-numbers"
mkdir -p "$BIN_DIR"
ln -sf "$ROOT/bin/scramble-numbers" "$TARGET"
info "Linked $TARGET → $ROOT/bin/scramble-numbers"

case ":$PATH:" in
  *":$BIN_DIR:"*) info "Done, try: scramble-numbers --help" ;;
  *)
    case "${SHELL:-}" in
      */zsh) rc="~/.zshrc" ;;
      *) rc="~/.bashrc" ;;
    esac
    warn "$BIN_DIR is not in your PATH. Add it and open a new terminal:"
    printf "  echo 'export PATH=\"%s:\$PATH\"' >> %s\n" "$BIN_DIR" "$rc"
    ;;
esac
