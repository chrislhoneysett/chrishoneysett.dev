#!/bin/bash
# Shared project settings. Source this file from the launch/log/stop commands.
set -euo pipefail
ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)
cd "$ROOT"
HERDR_CALLER_SESSION=${HERDR_SESSION:-}
HERDR_SESSION=knox
PERSONAL_CODEX_HOME=${PERSONAL_CODEX_HOME:-$HOME/.codex-personal}
export PATH="$HOME/.local/bin:$PATH"
fail() { printf '%s\n' "$*" >&2; exit 1; }
# A caller's socket overrides must never redirect this project's commands.
h() { env -u HERDR_SOCKET_PATH -u HERDR_CLIENT_SOCKET_PATH herdr --session "$HERDR_SESSION" "$@"; }
require_tools() {
  command -v herdr >/dev/null || fail 'Install Herdr first: https://herdr.dev'
  command -v jq >/dev/null || fail 'Install jq first: brew install jq'
}
project_node() {
  if [[ -s ${NVM_DIR:-$HOME/.nvm}/nvm.sh ]]; then
    source "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
    nvm use --silent
  fi
  [[ $(node --version) == "$(tr -d '[:space:]' < .nvmrc)" ]] || fail 'Select the Node version in .nvmrc first.'
}
find_workspace() {
  local workspaces panes
  workspaces=$(h workspace list) || return 1
  WORKSPACE=$(printf '%s' "$workspaces" | jq -er '[.result.workspaces[] | select(.label == "chrishoneysett.dev")] | if length == 0 then "" elif length == 1 then .[0].workspace_id else error("Multiple chrishoneysett.dev workspaces; inspect before continuing") end') || return 1
  [[ -n $WORKSPACE ]] || return 0
  # Display metadata tokens are not saved across Herdr server restarts. Pane
  # creation cwd is retained; do not use foreground_cwd (a shell can cd anywhere).
  panes=$(h pane list --workspace "$WORKSPACE") || return 1
  printf '%s' "$panes" | jq -e --arg root "$ROOT" '.result.panes | length > 0 and all(.[]; .cwd == $root)' >/dev/null || fail "chrishoneysett.dev has panes outside $ROOT (or unknown paths). Inspect it before switching checkouts."
}
pane_id() {
  h pane list --workspace "$WORKSPACE" | jq -er --arg label "$1" '[.result.panes[] | select(.label == $label)] | if length == 1 then .[0].pane_id else error("Expected one pane named " + $label) end'
}
start_in_idle_pane() {
  local info output attempt stable=0 attempts=1
  # A newly started server restores shells before their login startup finishes.
  # Wait for those shells rather than treating startup helpers as running apps.
  [[ ${3:-} != --wait-ready ]] || attempts=75
  for ((attempt=0; attempt<attempts; attempt++)); do
    info=$(h pane process-info --pane "$1") || return 1
    if printf '%s' "$info" | jq -e '.result.process_info | .shell_pid as $shell | $shell != null and (.foreground_processes | length == 1 and .[0].pid == $shell)' >/dev/null; then
      if [[ ${3:-} == --wait-ready ]]; then
        output=$(h pane read "$1" --source recent-unwrapped --lines 5) || return 1
        if [[ -n ${output//[[:space:]]/} ]]; then stable=$((stable+1)); else stable=0; fi
      else
        stable=3
      fi
      if ((stable >= 3)); then
        h pane run "$1" "$2" >/dev/null
        return
      fi
    else
      stable=0
    fi
    ((attempt+1 >= attempts)) || sleep 0.2
  done
  if [[ ${3:-} == --wait-ready ]]; then
    fail "Pane $1 did not reach an idle shell prompt during startup. Inspect its output; no command was sent."
  fi
  printf 'Pane %s already has a foreground process; leaving it running.\n' "$1"
}

attach_workspace() {
  h workspace focus "$WORKSPACE" >/dev/null
  # A shared session hosts a Space per project. Reuse its attached client
  # even when this launcher was invoked from a regular terminal.
  if [[ ${HERDR_ENV:-} == 1 && (${HERDR_SOCKET_PATH:-} == */sessions/"$HERDR_SESSION"/herdr.sock || (-z ${HERDR_SOCKET_PATH:-} && $HERDR_CALLER_SESSION == "$HERDR_SESSION")) ]] ||
     pgrep -u "$UID" -f "^([^[:space:]]*/)?herdr (--session ${HERDR_SESSION}|session attach ${HERDR_SESSION})$" >/dev/null; then
    printf 'Selected this project Space in the existing Herdr window.\n'
  elif [[ ${HERDR_ENV:-} == 1 ]]; then
    fail "The shared window is detached. From an outer terminal, run: herdr --session $HERDR_SESSION"
  else
    exec env -u HERDR_SOCKET_PATH -u HERDR_CLIENT_SOCKET_PATH herdr --session "$HERDR_SESSION"
  fi
}
