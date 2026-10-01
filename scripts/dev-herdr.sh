#!/bin/bash
# Personal-account Codex and Next.js, using one persistent three-pane workspace.
source "$(dirname "$0")/herdr-common.sh"

case ${1:-} in
  --codex)
    [[ $# == 1 ]] || fail 'Unexpected arguments.'
    project_node
    exec env -u OPENAI_API_KEY -u CODEX_API_KEY -u CODEX_ACCESS_TOKEN CODEX_HOME="$PERSONAL_CODEX_HOME" codex -c 'cli_auth_credentials_store="file"' --no-alt-screen -C "$ROOT"
    ;;
  --server)
    [[ $# == 1 ]] || fail 'Unexpected arguments.'
    project_node
    [[ -d node_modules/next ]] || fail 'Dependencies missing: run npm ci first.'
    if lsof -nP -iTCP:3000 -sTCP:LISTEN >/dev/null 2>&1; then
      fail 'Port 3000 is occupied. Inspect the existing server before starting another.'
    fi
    mkdir -p .herdr
    : > .herdr/next.log
    npm run dev:server -- --port 3000 2>&1 | tee .herdr/next.log
    exit
    ;;
  --login)
    [[ $# == 1 ]] || fail 'Unexpected arguments.'
    project_node
    command -v codex >/dev/null || fail 'Install Codex CLI first.'
    mkdir -p "$PERSONAL_CODEX_HOME"
    chmod 700 "$PERSONAL_CODEX_HOME"
    printf 'Sign in with your PERSONAL account. Codex home: %s\n' "$PERSONAL_CODEX_HOME"
    exec env -u OPENAI_API_KEY -u CODEX_API_KEY -u CODEX_ACCESS_TOKEN CODEX_HOME="$PERSONAL_CODEX_HOME" codex -c 'cli_auth_credentials_store="file"' login
    ;;
esac
[[ $# == 0 || ($# == 1 && $1 == --no-attach) ]] || fail 'Usage: npm run dev -- [--no-attach]'
require_tools
project_node
command -v codex >/dev/null || fail 'Install Codex CLI first.'
[[ -d node_modules/next ]] || fail 'Dependencies missing: run npm ci first.'
[[ -d $PERSONAL_CODEX_HOME ]] || fail 'Personal login missing. Run npm run dev:login with your personal account first.'
env -u OPENAI_API_KEY -u CODEX_API_KEY -u CODEX_ACCESS_TOKEN CODEX_HOME="$PERSONAL_CODEX_HOME" codex -c 'cli_auth_credentials_store="file"' login status || fail 'Run npm run dev:login with your personal account first.'

lock="${TMPDIR:-/tmp}/chrishoneysett.dev-herdr-${UID}.lock"
mkdir "$lock" 2>/dev/null || fail "Another launcher is running. If it crashed, inspect and remove $lock."
trap 'rmdir "$lock"' EXIT
mkdir -p .herdr
pane_readiness=
if ! h workspace list >/dev/null 2>&1; then
  nohup env -u HERDR_SOCKET_PATH -u HERDR_CLIENT_SOCKET_PATH herdr --session "$HERDR_SESSION" server > .herdr/server.log 2>&1 < /dev/null &
  ready=false
  for ((attempt=0; attempt<50; attempt++)); do
    if h workspace list >/dev/null 2>&1; then ready=true; break; fi
    sleep 0.2
  done
  [[ $ready == true ]] || fail 'Herdr server did not become ready. Inspect .herdr/server.log.'
  pane_readiness=--wait-ready
fi
find_workspace
seed_pane=
if [[ -n $WORKSPACE ]]; then
  panes=$(h pane list --workspace "$WORKSPACE")
  # A manually opened project workspace begins with one unlabeled terminal.
  # Keep it as SHELL so launching from that terminal never starts a server
  # in the pane that is still executing this script.
  seed_pane=$(printf '%s' "$panes" | jq -r 'if (.result.panes | length) == 1 and (.result.panes[0].label // "") == "" then .result.panes[0].pane_id else "" end')
fi
if [[ -z $WORKSPACE || -n $seed_pane ]]; then
  if lsof -nP -iTCP:3000 -sTCP:LISTEN >/dev/null 2>&1; then
    fail 'Port 3000 is occupied. Inspect the old dev server before starting Herdr.'
  fi
  if [[ -n $seed_pane ]]; then
    server_pane=$seed_pane
    tab=$(printf '%s' "$panes" | jq -er '.result.panes[0].tab_id')
  else
    created=$(h workspace create --cwd "$ROOT" --label 'chrishoneysett.dev' --env "CODEX_HOME=$PERSONAL_CODEX_HOME" --env "PATH=$PATH" --no-focus)
    WORKSPACE=$(printf '%s' "$created" | jq -er '.result.workspace.workspace_id')
    server_pane=$(printf '%s' "$created" | jq -er '.result.root_pane.pane_id')
    tab=$(printf '%s' "$created" | jq -er '.result.tab.tab_id')
  fi
  h tab rename "$tab" Development >/dev/null
  h pane rename "$server_pane" DEV >/dev/null
  codex_pane=$(h pane split "$server_pane" --direction right --ratio 0.4 --cwd "$ROOT" --env "CODEX_HOME=$PERSONAL_CODEX_HOME" --env "PATH=$PATH" --no-focus | jq -er '.result.pane.pane_id')
  h pane rename "$codex_pane" CODEX >/dev/null
  shell_pane=$(h pane split "$codex_pane" --direction down --ratio 0.75 --cwd "$ROOT" --env "CODEX_HOME=$PERSONAL_CODEX_HOME" --env "PATH=$PATH" --no-focus | jq -er '.result.pane.pane_id')
  h pane rename "$shell_pane" SHELL >/dev/null
  if [[ -n $seed_pane ]]; then
    h pane swap --source-pane "$seed_pane" --target-pane "$shell_pane" >/dev/null
    h pane rename "$seed_pane" SHELL >/dev/null
    h pane rename "$shell_pane" DEV >/dev/null
    server_pane=$shell_pane
    shell_pane=$seed_pane
  fi
  pane_readiness=--wait-ready
else
  server_pane=$(pane_id DEV)
  codex_pane=$(pane_id CODEX)
  pane_id SHELL >/dev/null
fi
printf -v server_cmd '/bin/bash %q --server' "$ROOT/scripts/dev-herdr.sh"
start_in_idle_pane "$server_pane" "$server_cmd" "$pane_readiness"
printf -v codex_cmd 'env PERSONAL_CODEX_HOME=%q /bin/bash %q --codex' "$PERSONAL_CODEX_HOME" "$ROOT/scripts/dev-herdr.sh"
start_in_idle_pane "$codex_pane" "$codex_cmd" "$pane_readiness"
h pane list --workspace "$WORKSPACE"
rmdir "$lock"
trap - EXIT
if [[ ${1:-} == --no-attach || ! -t 0 || ! -t 1 ]]; then
  printf '%s\n' 'Attach with: herdr --session knox'
else
  attach_workspace
fi
