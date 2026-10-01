#!/bin/bash
source "$(dirname "$0")/herdr-common.sh"
[[ $# == 0 ]] || fail 'Usage: npm run dev:stop'
require_tools
find_workspace
[[ -n $WORKSPACE ]] || { printf '%s\n' 'chrishoneysett.dev is already stopped.'; exit 0; }
h workspace close "$WORKSPACE"
printf '%s\n' 'Stopped the chrishoneysett.dev Space (Next.js, Codex, and shell).'
