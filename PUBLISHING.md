# Publishing `@envirobyte/ui` and auto-propagating to consumer apps

This doc is the single source of truth for how a change in this repo reaches
every team member's laptop and every deployed app.

## The four consumers

- `EnviroByte/rim-fe`
- `EnviroByte/atmosiq-fe`
- `EnviroByte/datapivot-fe`
- `EnviroByte/eos_portal`

All four are Next.js apps deployed on Vercel, with `main` auto-deploying to production.

## The pipeline (happy path)

```
┌───────────────────────────────────────────────────────────────────┐
│  1. Someone merges a PR to `main` in envirobyte-ui                │
│  2. They bump version in package.json + tag:                      │
│        npm version patch   (or minor / major)                     │
│        git push --follow-tags                                     │
└───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────┐
│  .github/workflows/publish.yml (envirobyte-ui)                    │
│  ───────────────────────────────────────────                      │
│  • verifies tag matches package.json                              │
│  • npm ci + typecheck + build                                     │
│  • publishes to GitHub Packages (auth = built-in GITHUB_TOKEN)    │
│  • dispatches `ui-package-updated` to all 4 consumers             │
│    (auth = secret `UI_DISPATCH_TOKEN`, a fine-grained PAT)        │
└───────────────────────────────────────────────────────────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼    (x4)
┌───────────────────────────────────────────────────────────────────┐
│  .github/workflows/update-ui.yml (each consumer)                  │
│  ───────────────────────────────────────────                      │
│  • `npm install @envirobyte/ui@<new-version>`                     │
│  • opens PR `chore/bump-envirobyte-ui` with the diff              │
│  • enables auto-merge (squash)                                    │
│  • CI runs. Green → auto-merges to main → Vercel redeploys.       │
└───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────┐
│  Team member runs `git pull` on their local consumer repo         │
│  .husky/post-merge detects package-lock.json changed → runs       │
│  `npm install`. They're back in sync without thinking.            │
└───────────────────────────────────────────────────────────────────┘
```

## The safety net

If the dispatch fails for some reason (token rotated, GitHub outage, repo renamed),
Dependabot in each consumer runs daily, spots the new version on GitHub Packages,
and opens the same kind of PR. You will never be silently stuck on an old version.

## Releasing a new version of `@envirobyte/ui`

```bash
# on main, after your change is merged
npm version patch           # or: minor, major
git push origin main --follow-tags
```

That's it. Expect:

- A new release of `@envirobyte/ui` on GitHub Packages within ~1 minute.
- 4 bot PRs appear, one per consumer, within ~2 minutes.
- Each PR auto-merges when its CI is green → Vercel deploys that app.

You can watch the whole thing in:

- This repo: **Actions → Publish @envirobyte/ui**
- Each consumer: **Actions → Update @envirobyte/ui**

## Manual re-trigger (recovery)

If consumers didn't get dispatched for any reason, run:

- **envirobyte-ui**: Actions → Publish @envirobyte/ui → Run workflow → supply
  `version_override` if needed (default is the current package.json version).
- **or in each consumer individually**: Actions → Update @envirobyte/ui →
  Run workflow → type the version (e.g. `0.3.1`).

## Required GitHub secrets

All the cross-repo secrets are already present at the org level or repo level.
The table below lists what's used and where.

### In `envirobyte-ui` (repo-level secret)

| Secret | Used by | Notes |
|---|---|---|
| `GITHUB_TOKEN` | `publish.yml` (publishing step) | Automatic. Works because the repo lives in the `EnviroByte` org and the package scope is `@envirobyte` — the token has package:write by default in that org. |
| `UI_CONSUMER_DISPATCH_TOKEN` | `publish.yml` (dispatch step) | Fine-grained PAT. Needs access to the 4 consumer repos and the **Pull requests**, **Contents**, **Actions** permissions listed below. |

### In each consumer (EnviroByte org-level secrets, inherited by all consumers)

| Secret | Used by | Notes |
|---|---|---|
| `NPM_TOKEN` | `ci.yml`, `update-ui.yml`, `dependabot.yml`, Vercel builds | Read-only. Any PAT with `read:packages` on the `EnviroByte` org. |
| `DISPATCH_TOKEN` | `update-ui.yml` (checkout + open PR + auto-merge) | Same fine-grained PAT as `UI_CONSUMER_DISPATCH_TOKEN`. Needs write access to each consumer repo. |

> The two names (`UI_CONSUMER_DISPATCH_TOKEN` in envirobyte-ui and `DISPATCH_TOKEN`
> at the org level) can hold the same PAT value. They're separate because one is
> scoped to envirobyte-ui only (for dispatching out) and the other is inherited
> by the consumers (for pushing in).

### Permissions required on the PAT behind `UI_CONSUMER_DISPATCH_TOKEN` / `DISPATCH_TOKEN`

Resource owner: **EnviroByte**. Repository access: **select repositories** →
`rim-fe`, `atmosiq-fe`, `datapivot-fe`, `eos_portal` (envirobyte-ui is not
required since this PAT is only used to dispatch **out** of envirobyte-ui, and
`GITHUB_TOKEN` handles publishing).

Repository permissions (all four must be set):

- **Contents**: Read and write
- **Pull requests**: Read and write  ← **commonly forgotten; required for `peter-evans/create-pull-request` and `gh pr merge --auto`**
- **Actions**: Read and write
- **Metadata**: Read (auto-selected)

### Dependabot secrets (separate bucket!)

Actions secrets and Dependabot secrets are two different stores in GitHub. Even
if `NPM_TOKEN` is set at the org Actions level, Dependabot cannot see it. You
must also set:

- **EnviroByte org → Settings → Secrets and variables → Dependabot → `NPM_TOKEN`** (same value as the Actions version), **OR**
- Each consumer → Settings → Secrets and variables → Dependabot → `NPM_TOKEN`.

Without this, Dependabot PRs silently fail to resolve `@envirobyte/ui`.

## One-time GitHub UI setup (per consumer repo)

1. Settings → General → Pull Requests → enable **Allow auto-merge**.
2. Settings → Branches → Protect `main`:
   - Require a pull request before merging (so bot PRs go through CI).
   - Require status checks to pass before merging.
   - Allow auto-merge (implicit if the repo-wide toggle is on).

## One-time Vercel setup (per consumer)

Each Vercel project → Settings → Environment Variables → add `NPM_TOKEN`
(same fine-grained PAT, `read:packages` only) for **Production**, **Preview**,
and **Development**. This lets Vercel resolve `@envirobyte/ui` during builds.
(`.npmrc` in each repo already references `${NPM_TOKEN}`.)

## Team member laptop setup (one-time per person)

1. Create a GitHub PAT with `read:packages` on the EnviroByte org. Put in shell rc:
   ```bash
   export NPM_TOKEN="ghp_..."
   ```
2. Clone any consumer repo and run `npm install`.
   - Husky installs its git hooks (via the `prepare` script).
   - `.npmrc` + `NPM_TOKEN` auth you against GitHub Packages.
3. From this point on:
   - `git pull` that changes the lockfile → hook runs `npm install` automatically.
   - No manual token fumbling per repo.
