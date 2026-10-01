# Personal site local guidance

Read [AGENTS.md](AGENTS.md), including the Next.js version-specific guidance.
Read [docs/local-development.md](docs/local-development.md) for the Herdr workflow.
Before diagnosing runtime behavior, inspect the DEV pane's last 300 lines in the
chrishoneysett.dev workspace of shared session knox. Discover pane IDs rather
than guessing them. Say when runtime logs are unavailable. Never restart healthy
processes or send commands into a pane running a foreground app.
Use the Node version in .nvmrc before Node/npm commands.
