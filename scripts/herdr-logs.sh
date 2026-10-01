#!/bin/bash
source "$(dirname "$0")/herdr-common.sh"
[[ $# == 0 ]] || fail 'Usage: npm run dev:logs'
require_tools
find_workspace || fail 'Shared Herdr session knox is unavailable; no logs inspected.'
[[ -n $WORKSPACE ]] || fail 'Personal-site workspace is unavailable; no logs inspected.'
h pane read "$(pane_id DEV)" --source recent-unwrapped --lines 300
