# Architecture Decisions

These are established decisions. Do not change them without explicit approval.

## 1. Versioning & Publishing

- Package is published to GitHub Packages as `@envirobyte/ui`.
- On every change: bump version in `package.json`, push to `main` with a tag to trigger the publish workflow.
- Consuming apps use `"@envirobyte/ui": "*"` (wildcard) so they always pull the latest version on `npm install` without manual bumps.

## 2. Consuming Apps

| App | Repo | Uses `@envirobyte/ui` |
|---|---|---|
| DataPivot | `datapivot-fe` | Yes |
| RIM | `rim-fe` | Yes |
| AtmosIQ | `atmosiq-fe` | Yes |
| EOS Portal | `eos_portal` | Yes |
| EmissionX | `emissionx-frontend` | **No** — has its own component set |

## 3. Wildcard Version Strategy (Current)

All four consuming apps pin `"@envirobyte/ui": "*"` in `package.json`. This means:
- No manual `package.json` bumps needed in consuming repos after publishing.
- Every `npm install` or CI build picks up the latest published version automatically.
- **Trade-off**: a breaking change in this library can silently break all apps on their next build/deploy. Be careful with breaking changes.

## 4. Automated Lockfile Updates (Active)

After each publish, GitHub Actions automatically updates the `package-lock.json` in all consumer repos so Vercel picks up the new version immediately.

### How it works

1. `envirobyte-ui` publish workflow (`.github/workflows/publish.yml`) runs after a `v*` tag push.
2. After `npm publish` succeeds, it fires a `repository_dispatch` event (`ui-package-updated`) to all 4 consumer repos using `DISPATCH_TOKEN`.
3. Each consumer repo has `.github/workflows/update-ui.yml` that:
   - Checks out the repo
   - Runs `npm update @envirobyte/ui` (updates the lockfile, respects `"*"` in package.json)
   - Commits and pushes `package-lock.json` with message `chore: update @envirobyte/ui to <version>`
4. Vercel detects the new commit → deploys with the fresh lockfile → fresh `npm install` → correct CSS generated.

### Required GitHub Secrets

| Secret | Where to set | Value |
|---|---|---|
| `DISPATCH_TOKEN` | `envirobyte-ui` repo | GitHub PAT with `repo` scope (to dispatch to other repos) |
| `NPM_TOKEN` | each consumer repo (`eos_portal`, `datapivot-fe`, `rim-fe`, `atmosiq-fe`) | GitHub PAT with `read:packages` scope |
| `DISPATCH_TOKEN` | each consumer repo | GitHub PAT with `contents: write` scope (to push lockfile commits) |

> The simplest setup: use a single PAT with `repo` + `read:packages` + `workflow` scopes and add it as both `DISPATCH_TOKEN` and `NPM_TOKEN` everywhere.

### The full publish flow (no manual steps)

```
npm version patch && git push origin main --tags
        ↓
  publish.yml runs
        ↓
  npm publish → v0.x.x on GitHub Packages
        ↓
  repository_dispatch → 4 consumer repos
        ↓
  update-ui.yml runs in each repo
        ↓
  npm update @envirobyte/ui → lockfile updated → git push
        ↓
  Vercel deploys with fresh lockfile → correct CSS → live
```

## 4. NPM Token Setup for Consuming Apps

Each consuming app needs this in `.npmrc`:

```
@envirobyte:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

`NPM_TOKEN` must be set as:
- An environment variable locally (or in shell profile)
- A repository secret in CI (GitHub Actions)

This is a one-time setup per repo.

## 5. Local Development

Consuming apps support `LOCAL_UI=1` in their env, which aliases `@envirobyte/ui` imports to `../envirobyte-ui/src`. Use this for real-time local iteration — no publish cycle needed.
