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

### Future: GitHub Actions Auto-Bump (Tabled)

When the risk of breaking changes grows, migrate to a GitHub Actions workflow:
1. `envirobyte-ui` publish workflow fires a `repository_dispatch` event to each consuming repo.
2. Each consuming repo has a workflow that bumps `@envirobyte/ui` to the exact new version, runs `npm install`, and commits the updated `package.json` + `package-lock.json`.
3. This gives automatic updates with full traceability and easy rollback per-app.

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
