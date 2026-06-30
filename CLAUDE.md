# ZeroCom — Claude Code Operating Manual

## Project Identity
ZeroCom: Zero-commission P2P real estate marketplace for Greater China.
Phase 1: Mainland China (Shanghai, Beijing, Shenzhen, Hangzhou, Chengdu, etc.)
Phase 2: Hong Kong SAR (deferred)

## Architecture
- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui
- **Backend**: Next.js API routes + Prisma Client over PostgreSQL
- **Cache**: Redis (docker-compose)
- **Auth**: JWT (HS256) + phone OTP + scrypt passwords + TOTP
- **Payments**: Alipay SDK + WeChat Pay V3 (real SDKs, not mocks)
- **Anti-broker**: broker-risk engine + enforcement_actions + honeypot listings
- **DevOps**: Docker Compose (postgres:16-alpine + redis), Dockerfile, .github CI
- **Tests**: Vitest (19 tests, `npx vitest run`)

## Context Budget (HARD RULES)
- **RESET at 65% context** — commit work, then /reset or start fresh session
- **STOP at 80% context** — must ask human for direction
- **NEVER exceed 90% context** — quality degrades silently past this point
- **One Pomodoro = 25 min max** — if not done, commit WIP and reset

## Session Reset Protocol
1. `git add . && git commit -m "wip: <what-you-did> [pomodoro N]"`
2. `/reset` or `exit` then `claude --no-context`
3. Read ONLY `CURRENT_TASK.md` + files needed for next task
4. Do NOT re-read PRD.md, AGENTS.md, or full codebase

## File Reading Rules
### ALWAYS read first:
- `CURRENT_TASK.md` — single source of truth for active task
- `package.json` — scripts and dependencies

### NEVER read unless explicitly needed:
- `PRD.md` — read once at project start only
- `AGENTS.md` — same
- Full `migrations/` directory — only latest if needed
- `node_modules/`
- Test files not being fixed
- Any file >500 lines without specific reason

### Use @file references:
- Reference files by path instead of pasting contents
- Let Claude Code manage when to load content
- Example: "Fix the bug in @src/api/listings.js" not pasting the file

## Git Discipline
- Commit every Pomodoro: `git commit -m "feat|fix|chore: <desc> [pomodoro N]"`
- Never leave uncommitted changes across session resets
- Use `git diff` to catch up after reset instead of re-reading files
- Write meaningful commit messages — they become context after reset

## Task Isolation
- One prompt = one task only
- No multi-task megaprompts
- If blocked >10 min: document blocker, commit, skip to next task
- Current task always defined in `CURRENT_TASK.md`

## Context Hygiene
- **Avoid pasting large files** — use @filename references
- **Keep error messages scoped** — 3 relevant lines, not full stack trace
- **Clear exploratory conversations** — remove dead-end attempts before continuing
- **Use /compact at task boundaries** — after completing a feature, before starting next
- **Start new sessions for distinct tasks** — don't drift across features

## Hermes Reporting
After every 3 Pomodoros (or at session reset):
```bash
curl -s -X POST http://localhost:8765/hermes/report \
  -H "Content-Type: application/json" \
  -d "{\"project\":\"zerocom\",\"status\":\"<one-line summary>\",\"blockers\":\"<or empty>\",\"next_task\":\"<next>\"}"
```

## Code Conventions
- Use async/await, not callbacks
- Error handling: always wrap in try/catch, return structured errors
- Naming: camelCase for vars, PascalCase for classes, kebab-case for files
- Comments: explain WHY not WHAT
- No console.log in production code — use proper logger

## Testing
- Run tests before committing: `npm run test:all`
- Fix broken tests immediately — don't commit red
- Test files: keep alongside source, not in separate directory

## Current Sprint
See `CURRENT_TASK.md` for active task. This file is the single source of truth.
Update it at end of each session with: completed work, remaining tasks, next steps.
