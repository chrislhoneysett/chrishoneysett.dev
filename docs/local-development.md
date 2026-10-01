# Personal site development with Herdr

Prerequisites: Herdr, jq, Codex CLI, the Node version in `.nvmrc`, and installed
project dependencies. The `codex` command uses the CLI bundled with your desktop
app through your existing `~/.local/bin/codex` symlink.

## First launch

```bash
source "$HOME/.nvm/nvm.sh"
nvm use --silent
npm run dev:login # Sign in with your PERSONAL account once.
npm run dev
```

Codex uses `~/.codex-personal`, independently of Knox's `~/.codex-work`.
No credentials are copied. Login and launch use file credential storage in the
selected home and remove inherited API-key/access-token variables. Settings,
plugins, and session history are separate too. `PERSONAL_CODEX_HOME` can select
another personal home; use the same value for login and launch.

Shared session `knox` hosts both projects in one Herdr window. This project has
its own `chrishoneysett.dev` Space:

```text
+------------------+------------------+
|                  | CODEX (personal) | 75% height
| DEV (Next.js)    +------------------+
| full height      | SHELL            | 25% height
+------------------+------------------+
```

The left column uses 40% of the width, the right 60%. Next.js listens on port 3000.
DEV displays server output and also saves it to `.herdr/next.log`; each server
launch resets that log. `.herdr/` is ignored by Git. `npm run dev:logs` reads
recent DEV output without creating another pane. `npm run dev:server` runs
Next.js directly without Herdr. Do not run both server workflows simultaneously.

Repeated `npm run dev` reuses the existing panes and processes. A manually opened
single-terminal workspace named `chrishoneysett.dev` is expanded into the three-pane
layout, keeping that terminal as the bottom-right SHELL. Cold starts wait
for restored login shells before submitting commands. A lock prevents duplicate
launches. Another checkout's pane paths are rejected; close its workspace first
if intentionally changing checkouts. Stale locks require inspection before removal.

Detach with Ctrl-b then q, or close the terminal to keep processes running.
Reconnect with `herdr --session knox` (bare `herdr` selects the default).
`npm run dev -- --no-attach` starts without opening the UI.
`npm run dev` creates or focuses this project's Space in the shared window.
From a regular terminal it attaches only if no client is already open; otherwise
it focuses the Space in the existing window. Inside Herdr, changing to this
project's folder and running `npm run dev` selects the personal Space directly.

```bash
npm run dev:stop
```

This closes only the `chrishoneysett.dev` Space and stops its Next.js, Codex, and
shell processes. Knox remains running. The next launch recreates the layout.
To stop all Spaces and their processes, use `herdr --session knox server stop`.

## Runtime inspection

Inside Herdr, load `herdr --skill` if needed, then run `npm run dev:logs` after
selecting project Node. Or use `bash scripts/herdr-logs.sh` directly. This reads
the DEV pane's last 300 lines. Use `herdr --session knox workspace list`
and `pane list --workspace ID` to discover actual IDs. Expand bounded captures
only as needed. State when logs are unavailable; absence of an error does not
prove an operation succeeded. Inspect foreground processes before restarting
commands; never inject commands into a running app. Herdr startup diagnostics
are in `.herdr/server.log`.
