# Personal site development with Herdr

Use the Node version in `.nvmrc` before running npm commands:

```bash
source "$HOME/.nvm/nvm.sh"
nvm use --silent
```

## Run Next.js

```bash
npm run dev
```

This runs `next dev` in your current terminal, with normal Next.js output and
Ctrl-C behavior. It does not configure or contact Herdr or require Codex login.
Next.js defaults to port 3000. Pass options normally, for example
`npm run dev -- --port 3001`.

## Set up the optional Herdr layout

Prerequisites: Herdr, jq, and the `codex-personal` launcher in `~/.local/bin`.
Setup and login call `codex-personal` explicitly, so a `codex` command that
selects the work account cannot redirect this workspace to that account.

```bash
npm run herdr:login # Sign in with your PERSONAL account once.
npm run herdr
```

Run `npm run herdr` from an idle shell inside Herdr, including the project's
existing Space, or from a regular terminal. It creates or reuses this project's
`chrishoneysett.dev` Space in the default session (the same one used by plain `herdr`):

```text
+------------------+------------------+
|                  | CODEX (personal) | 75% height
| DEV              +------------------+
| full height      | SHELL            | 25% height
+------------------+------------------+
```

The left column uses 40% of the width, the right 60%. The setup command starts
personal Codex in an idle CODEX pane and leaves existing foreground applications
running. It does not start Next.js or check its port. After setup, select DEV and
run `npm run dev` yourself. Ctrl-C in DEV stops Next.js and returns to the prompt.

Repeated `npm run herdr` reuses the existing panes and processes. A manually
opened single-terminal workspace named `chrishoneysett.dev` is expanded into the
three-pane layout, keeping that terminal as the bottom-right SHELL. Cold starts
wait for restored login shells before submitting the Codex command. A lock
prevents duplicate setup. Another checkout's pane paths are rejected; close its
workspace first if intentionally changing checkouts. Stale locks require
inspection before removal.

Codex uses `~/.codex-personal`, independently of Knox's `~/.codex-work`.
No credentials are copied. Login and launch use file credential storage in the
selected home and remove inherited API-key/access-token variables. Settings,
plugins, and session history are separate too. `PERSONAL_CODEX_HOME` can select
another personal home; use the same value for login and setup.

Detach with Ctrl-b then q, or close the terminal to keep processes running.
Reconnect with `herdr`.
`npm run herdr -- --no-attach` sets up the layout without opening the UI.
From a regular terminal, setup attaches only if no client is already open;
otherwise it focuses the Space in the existing window. Inside Herdr it selects
the project Space and returns to your shell.

```bash
npm run herdr:stop
```

This closes only the `chrishoneysett.dev` Space and stops its pane processes,
including Next.js if you started it there. The default Herdr session remains running. The next setup
recreates the layout. To stop all Spaces and their processes, use
`herdr server stop`.

## Runtime inspection

Run `npm run herdr:logs` after selecting project Node, or use
`bash scripts/herdr-logs.sh` directly. This discovers the DEV pane and reads its
last 300 lines without creating another pane. Run the server in DEV for this
command to show its output. `npm run dev` writes to the terminal; it does not
save a `.herdr/next.log` file.

Use `herdr workspace list` and `pane list --workspace ID` to
discover actual IDs. Expand bounded captures only as needed. State when logs
are unavailable; absence of an error does not prove an operation succeeded.
Inspect foreground processes before restarting commands; never inject commands
into a running app. Herdr startup diagnostics are in `.herdr/server.log`.
