# Publishing `@envirobyte/ui` and auto-propagating to all consumer apps

> **Status**: Verified working end-to-end on 2026-04-16.
> Tag `v0.2.2` → all 4 consumers on `main` in ~2 minutes.

This is the **single source of truth** for how a change in this repo reaches
every deployed app and every team member's laptop — fully automated.

---

## The 4 consumer apps

All four are Next.js apps deployed on Vercel, auto-deploying from `main`:

- `EnviroByte/rim-fe`
- `EnviroByte/atmosiq-fe`
- `EnviroByte/datapivot-fe`
- `EnviroByte/eos_portal`

---

## The pipeline (happy path — this is what actually runs)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. Merge your PR into `main` in envirobyte-ui                       │
│                                                                     │
│ 2. Bump version + tag:                                              │
│       npm version patch       (or minor / major)                    │
│       git push origin main --follow-tags                            │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│ envirobyte-ui/.github/workflows/publish.yml                         │
│ ─────────────────────────────────────────────                       │
│  • sanity-checks tag vs package.json                                │
│  • npm ci + typecheck + build                                       │
│  • `npm publish` to GitHub Packages (auth: built-in GITHUB_TOKEN)   │
│  • fan-out matrix job dispatches `ui-package-updated` to all 4      │
│    consumer repos (auth: UI_CONSUMER_DISPATCH_TOKEN secret)         │
└─────────────────────────────────────────────────────────────────────┘
                                │
            ┌───────────────────┼───────────────────┐
            ▼                   ▼                   ▼    (x4)
┌─────────────────────────────────────────────────────────────────────┐
│ each consumer/.github/workflows/update-ui.yml                       │
│ ─────────────────────────────────────────────                       │
│  • `npm install @envirobyte/ui@<new-version>` (refreshes lockfile)  │
│  • opens PR on branch `chore/bump-envirobyte-ui`                    │
│  • enables auto-merge (squash) via `gh pr merge --auto`             │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│ each consumer/.github/workflows/ci.yml (on the bot PR)              │
│ ─────────────────────────────────────────────                       │
│  • npm ci + typecheck + build                                       │
│  • GREEN → ruleset lets auto-merge squash the PR into `main`        │
│  • Vercel sees new `main` → auto-deploys                            │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Team member runs `git pull` on their local clone                    │
│  • .husky/post-merge detects package-lock.json changed              │
│  • runs `npm install` automatically                                 │
│  • developer is back in sync without thinking about it              │
└─────────────────────────────────────────────────────────────────────┘
```

**End-to-end verified timing**: ~2 minutes from `git push --follow-tags`
to all 4 consumer `main` branches updated.

---

## Releasing a new version

On `main` of this repo, after your change is merged:

```bash
npm version patch       # or: minor, major
git push origin main --follow-tags
```

That's literally it. Monitor:

- **envirobyte-ui** → Actions → `Publish @envirobyte/ui`
- Each consumer → Actions → `Update @envirobyte/ui`
- Each consumer → Pull Requests → bot PR auto-merges

---

## The safety net: Dependabot

Each consumer has `.github/dependabot.yml` that runs daily and opens a PR
for any new `@envirobyte/ui` version. This catches the (rare) case where
the live `repository_dispatch` fails (token rotated, GitHub outage, etc).

**Requires**: `NPM_TOKEN` in the **Dependabot secrets** bucket (separate
from Actions secrets!) at either org or repo level.

---

## Required GitHub secrets — the actual mapping

### envirobyte-ui repo → Settings → Secrets → Actions

| Secret | Used by | Notes |
|---|---|---|
| `GITHUB_TOKEN` | `publish.yml` (publishing step) | Automatic. Works because envirobyte-ui lives in `EnviroByte` org and package scope is `@envirobyte` — `GITHUB_TOKEN` has `packages: write` in that org by default. |
| `UI_CONSUMER_DISPATCH_TOKEN` | `publish.yml` (dispatch to consumers) | Fine-grained PAT with write access to the 4 consumer repos. |

### EnviroByte org → Settings → Secrets → Actions (inherited by all consumers)

| Secret | Used by | Notes |
|---|---|---|
| `DISPATCH_TOKEN` | each consumer's `update-ui.yml` (checkout, open PR, auto-merge) | Same fine-grained PAT value as `UI_CONSUMER_DISPATCH_TOKEN` above. Can be the same token; they're named differently because one is scoped to envirobyte-ui and one is inherited by consumers. |
| `NPM_TOKEN` | Dependabot, local dev, Vercel | **Classic PAT** with `read:packages` scope. Fine-grained PATs do NOT work reliably with GitHub Packages npm registry — use classic. |

### EnviroByte org → Settings → Secrets → **Dependabot** (SEPARATE bucket!)

| Secret | Used by | Notes |
|---|---|---|
| `NPM_TOKEN` | `dependabot.yml` in each consumer | Same classic PAT as above. GitHub keeps Actions and Dependabot secrets in two different stores. Forgetting this causes silent Dependabot failures. |

### PAT permission details

**`UI_CONSUMER_DISPATCH_TOKEN` / `DISPATCH_TOKEN`** — fine-grained PAT.

- Resource owner: `EnviroByte`
- Repository access: the 4 consumer repos (envirobyte-ui itself is not needed)
- Repository permissions:
  - Contents: **Read and write**
  - Pull requests: **Read and write** ← commonly forgotten; required for `peter-evans/create-pull-request` and `gh pr merge --auto`
  - Actions: **Read and write**
  - Metadata: Read (auto)

**`NPM_TOKEN`** — classic PAT.

- Scope: `read:packages` only
- If org has SSO enforcement: click `Configure SSO` on the token after creation, authorize for `EnviroByte`

---

## Per-consumer GitHub UI setup

This is one-time setup for each of the 4 consumer repos. See
[`docs/BRANCH_RULESET.md`](docs/BRANCH_RULESET.md) for exact screen-by-screen
field values.

Summary:

1. **Settings → General → Pull Requests → `Allow auto-merge`** → ON
2. **Settings → Rules → Rulesets → New branch ruleset** → create `Protect main`
   with the settings in `docs/BRANCH_RULESET.md`
3. **Settings → Secrets and variables → Dependabot → `NPM_TOKEN`** (unless
   org-level Dependabot secret already inherits)

---

## Vercel setup (per project)

Each of the 4 Vercel projects:

- Settings → Environment Variables → `NPM_TOKEN`
- Value: the classic PAT (`read:packages`)
- Environments: **Production**, **Preview**, **Development**

The repo's `.npmrc` references `${NPM_TOKEN}` — no other Vercel config needed.

---

## Team member laptop setup (one-time per person)

```bash
# 1. Create a classic PAT at https://github.com/settings/tokens/new
#    Scope: read:packages (only)
#    Authorize SSO for EnviroByte if prompted
#    Copy the ghp_... value

# 2. Add to shell rc (persists across sessions)
echo 'export NPM_TOKEN="ghp_your_classic_pat_here"' >> ~/.zshrc
source ~/.zshrc

# 3. Clone any consumer repo
git clone git@github.com:EnviroByte/atmosiq-fe.git
cd atmosiq-fe

# 4. Install (this triggers husky via `prepare` script → installs git hooks)
npm install
```

From here on, every `git pull` that changes `package-lock.json` automatically
runs `npm install`. No manual re-auth per repo.

---

## Manual re-trigger (if automation failed)

### Re-run the whole pipeline for an existing version

```
envirobyte-ui → Actions → Publish @envirobyte/ui → Run workflow
  • version_override: 0.3.1    (optional; defaults to package.json)
```

### Re-run just one consumer

```
consumer repo → Actions → Update @envirobyte/ui → Run workflow
  • version: 0.3.1    (required input)
```

---

## How this was verified

| Event | Timestamp | Result |
|---|---|---|
| `npm version patch` on envirobyte-ui | T+0s | tag `v0.2.2` created |
| `git push --follow-tags` | T+0s | pushed to GitHub |
| `Publish @envirobyte/ui` workflow | T+~10s | success; 0.2.2 on registry |
| Dispatch to all 4 consumers | T+~30s | all 4 received |
| Bot PR opened in each consumer | T+~60s | `chore: bump @envirobyte/ui to 0.2.2` |
| CI passed on each bot PR | T+~120s | green |
| Auto-merge squashed to `main` | T+~130s | all 4 on 0.2.2 |

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Consumer CI fails `npm ci` with 403 on `@envirobyte/ui` | Package is private and consumer repo not linked | Make package public (repo settings), OR link each consumer under `Manage Actions access` on the package |
| `update-ui.yml` fails `Missing: husky@X from lock file` | `package.json` changed but lockfile not refreshed | Run `npm install` locally, commit the lockfile |
| `update-ui.yml` fails opening PR with 403 | PAT missing `Pull requests: write` | Edit the fine-grained PAT, add the permission |
| Dependabot PRs never appear | `NPM_TOKEN` not in **Dependabot** secrets bucket | Add it at org or repo level under `Settings → Secrets → Dependabot` |
| Vercel build fails on `@envirobyte/ui` | Vercel env var `NPM_TOKEN` missing | Add in project settings for all 3 environments |
| Auto-merge doesn't fire after CI green | `Allow auto-merge` toggle off, OR ruleset requires approvals > 0 | Enable the toggle in `Settings → General`. Set `Required approvals = 0` in the ruleset |
| CI fails `next lint: no such directory: /.../lint` | Next.js 16 removed the `next lint` command | Already handled; CI no longer runs lint. Follow-up: migrate to direct ESLint |
