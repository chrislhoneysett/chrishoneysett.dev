#!/bin/bash
# Mock Herdr responses; never send input to real panes.
source "$(dirname "$0")/herdr-common.sh"
HERDR_ENV=1
HERDR_CALLER_SESSION=default
HERDR_SOCKET_PATH="${XDG_CONFIG_HOME:-$HOME/.config}/herdr/herdr.sock"
h() {
  [[ $* == 'pane current --current' ]] || fail "Unexpected command: $*"
  printf '%s\n' '{"result":{"pane":{"pane_id":"test:dev"}}}'
}
is_caller_pane test:dev || fail 'DEV caller was not recognized'
if is_caller_pane test:shell; then fail 'Another pane matched the caller'; fi
HERDR_ENV=0
if is_caller_pane test:dev; then fail 'Plain terminal matched a pane'; fi
HERDR_ENV=1
HERDR_SOCKET_PATH=/tmp/herdr/sessions/another/herdr.sock
if is_caller_pane test:dev; then fail 'Another session matched a pane'; fi
HERDR_SOCKET_PATH=
is_caller_pane test:dev || fail 'Session-name fallback failed'
HERDR_CALLER_SESSION=another
if is_caller_pane test:dev; then fail 'Another caller session matched'; fi

# An occupied target must never receive pane run or any other input.
h() {
  [[ $* == 'pane process-info --pane test:dev' ]] || fail "Unsafe command: $*"
  printf '%s\n' '{"result":{"process_info":{"shell_pid":1,"foreground_processes":[{"pid":2}]}}}'
}
start_in_idle_pane test:dev 'must not run'
printf '%s\n' 'Herdr caller detection and busy-pane checks passed.'

# Inside Herdr, focus and return even if inherited session metadata is absent
# or names a different session. Never try to attach another client.
WORKSPACE=test:workspace
HERDR_ENV=1
h() {
  [[ $* == 'workspace focus test:workspace' ]] || fail "Unexpected command: $*"
}
pgrep() { fail 'In-Herdr setup must not depend on client process matching'; }
HERDR_CALLER_SESSION=
HERDR_SOCKET_PATH=
attach_workspace
HERDR_CALLER_SESSION=another
HERDR_SOCKET_PATH=/tmp/custom-herdr.sock
attach_workspace
printf '%s\n' 'In-Herdr setup returns successfully without attachment checks.'
