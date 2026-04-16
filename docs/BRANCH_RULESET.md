# Branch ruleset: `Protect main` (per consumer)

Apply this **identical** ruleset to every one of the 4 consumer repos:
- `EnviroByte/rim-fe`
- `EnviroByte/atmosiq-fe`
- `EnviroByte/datapivot-fe`
- `EnviroByte/eos_portal`

The ruleset's purpose:
1. Prevent accidental destructive operations on `main` (force-push, delete).
2. Force every change through a PR + CI gate.
3. Let the **bot-created `chore: bump @envirobyte/ui` PR** auto-merge once CI
   is green, with zero human approvals required.

---

## Where to configure

```
https://github.com/EnviroByte/<repo>/settings/rules
```

Or: **Repo → Settings → Rules → Rulesets → New branch ruleset**.

---

## Field-by-field values

### Top section

| Field | Value |
|---|---|
| Ruleset name | `Protect main` |
| Enforcement status | `Active` |
| Bypass list | *(empty)* |

### Target branches

| Field | Value |
|---|---|
| Add target | `Include default branch` (targets `main`) |

> If your repo's default branch isn't `main`, use "Include by pattern" with `main` instead.

### Branch rules

| Rule | Setting |
|---|---|
| Restrict creations | OFF |
| Restrict updates | OFF |
| **Restrict deletions** | **ON** |
| Require linear history | OFF |
| Require deployments to succeed | OFF |
| Require signed commits | OFF |
| **Require a pull request before merging** | **ON** (expand + configure below) |
| **Require status checks to pass** | **ON** (expand + configure below) |
| **Block force pushes** | **ON** |
| Require code scanning results | OFF |
| Require code quality results | OFF |
| Automatically request Copilot code review | OFF |
| Restrict commit metadata | OFF |
| Restrict branch names | OFF |

### Inside "Require a pull request before merging"

| Sub-rule | Value |
|---|---|
| **Required approvals** | **`0`** ← **critical for bot auto-merge** |
| Dismiss stale pull request approvals when new commits are pushed | OFF |
| Require review from specific teams | OFF |
| Require review from Code Owners | OFF |
| Require approval of the most recent reviewable push | OFF |
| Require conversation resolution before merging | OFF |
| Allowed merge methods | **`Squash` only** (uncheck `Merge` and `Rebase`) |

### Inside "Require status checks to pass"

| Sub-rule | Value |
|---|---|
| Require branches to be up to date before merging | ON |
| Do not require status checks on creation | OFF |
| **Status checks that are required** | Add: `build` (source: `GitHub Actions`) |

> The `build` check won't appear until after the repo's `ci.yml` has run at
> least once. If you don't see it, push any commit to `main` (or to a test
> branch), wait for CI to complete, then come back and add it.

---

## Why `Required approvals = 0`

The whole point of this pipeline is: **bot publishes UI → bot bumps
consumers → bot merges**. A bot can't approve its own PR. If approvals > 0,
every UI version bump will sit in a PR forever until a human approves it,
defeating the automation.

The `build` status check is the gate — if CI is green, the PR has already
been proven to install, typecheck, and build successfully with the new UI.
That's your safety net, not a human-review bottleneck.

---

## Also required (separate from ruleset)

### `Settings → General → Pull Requests`

- **Allow auto-merge** → ON ← REQUIRED

Without this, `gh pr merge --auto` errors with `auto-merge is not enabled`.
The ruleset enforces *what must be true* to merge; this toggle enables the
*mechanism* that waits for those conditions.

### Suggested but not required

- `Automatically delete head branches` → ON  
  Keeps the repo clean after `chore/bump-envirobyte-ui` merges.

---

## Verification checklist

After configuring on a consumer, verify with a smoke test:

- [ ] Open a branch with a trivial change to `main`. Try to `git push --force` — should be rejected.
- [ ] Try to open a PR without CI running — should be blocked from merging until `build` runs.
- [ ] Observe the next `chore: bump @envirobyte/ui to X.Y.Z` PR: CI runs, goes green, PR squash-merges automatically.

---

## Rolling this out to all 4 consumers

```
Repo: atmosiq-fe     → ruleset applied 2026-04-16  ✅
Repo: rim-fe         → [ ] TODO
Repo: datapivot-fe   → [ ] TODO
Repo: eos_portal     → [ ] TODO
```

Replicate the exact settings above in each — they're identical across
consumers because the CI workflow and the auto-merge flow are identical.

---

## Common misconfigurations

| Mistake | Symptom | Fix |
|---|---|---|
| Approvals = 1 | Bot PRs stuck "waiting for review" | Set to 0 |
| `Merge` / `Rebase` allowed | Git history gets non-linear commits from CI | Keep only `Squash` |
| Required check not named `build` | Ruleset never considers CI passing | Check the check name in a CI run → copy exactly |
| "Allow auto-merge" toggle OFF | `gh pr merge --auto` fails | Enable in Settings → General |
| Restrict deletions OFF | Someone could `git push --delete origin main` | Keep ON |
| Block force pushes OFF | Someone could rewrite history | Keep ON |
