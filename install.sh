#!/usr/bin/env bash
# Links the scramble-numbers, scramble-text and scramble-publication commands into ~/.local/bin (macOS, Linux, WSL)
set -euo pipefail

ROOT="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="${SCRAMBLE_NUMBERS_BIN_DIR:-$HOME/.local/bin}"
COMMANDS=(scramble-numbers scramble-text scramble-publication)

info() { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33mwarn:\033[0m %s\n' "$*" >&2; }
die() { printf '\033[1;31merror:\033[0m %s\n' "$*" >&2; exit 1; }

command -v node >/dev/null || die "Node.js not found, install Node.js 20 or newer first"
major="$(node -p 'process.versions.node.split(".")[0]')"
(( major >= 20 )) || die "Node.js $(node --version) is too old, 20 or newer is needed"

mkdir -p "$BIN_DIR"
for cmd in "${COMMANDS[@]}"; do
  chmod +x "$ROOT/bin/$cmd"
  ln -sf "$ROOT/bin/$cmd" "$BIN_DIR/$cmd"
  info "Linked $BIN_DIR/$cmd → $ROOT/bin/$cmd"
done

case ":$PATH:" in
  *":$BIN_DIR:"*) info "Done, try: scramble-publication --help" ;;
  *)
    case "${SHELL:-}" in
      */zsh) rc="~/.zshrc" ;;
      *) rc="~/.bashrc" ;;
    esac
    warn "$BIN_DIR is not in your PATH. Add it and open a new terminal:"
    printf "  echo 'export PATH=\"%s:\$PATH\"' >> %s\n" "$BIN_DIR" "$rc"
    ;;
esac
