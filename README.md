# Beatza Frontend

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Formatting:** Prettier

---

## Getting Started
```bash
npm install
npm run dev
```

---

## Git Workflow

Follow these steps every time you start working on a new feature:

### 1. Pull the latest dev
Always make sure your local dev is up to date before creating a branch.
```bash
git checkout dev
git pull origin dev
```

### 2. Create a new branch
Create your branch from dev using this naming convention:
```
{feature-name}
```

**Examples:**
```
login-form
profile-header
audio-upload
```

### 3. Work on your feature
Make your changes, then stage and commit using the commit convention below.

### 4. Push your branch
```bash
git push origin login-form
```

### 5. Open a Pull Request
- Go to the repository on GitHub
- Click **"Compare & pull request"**
- Add a clear title and description using the PR format below
- Request a review from a teammate
- Do **not** merge your own PR

---

## Daily Workflow Rules

These rules apply to every team member, including the team leader, every single day.

### Daily Pull Requests
- Every member **must** open a pull request by end of day for any changes made that day, no exceptions.
- All PRs are targeted at the **`dev`** branch.

### Merge Window
- The team leader reviews and accepts all pending PRs into `dev` **every day between 10–11 PM**.

### Daily Rebase
- After 11 PM (once all PRs have been merged), every member must rebase their active branches on top of the updated `dev` to stay in sync.
```bash
git fetch origin
git rebase origin/dev
```

### Protected Branches
- **No one** is allowed to push directly to `main` or `dev`.
- **No one** is allowed to rebase from `main`.
- **No one** is allowed to merge their own pull request.

### Communication Across Other Sub Teams
- Any communication with members of other sub-teams must go through the frontend team leader first.
- Do not reach out to other sub-team members directly without notifying the team leader.

---

## Commit Convention

Every commit must follow this structure:
```
[keyword] - [feature] - [explanation]
```

| Part | Description | Example |
|------|-------------|---------|
| `keyword` | Type of change (see table below) | `feat` |
| `feature` | The feature or area being worked on | `login-form` |
| `explanation` | Short description of what was done | `add validation logic` |

### Keywords

| Keyword | Meaning |
|---------|---------|
| `added` | New feature or functionality |
| `fixed` | Bug fix |
| `styled` | UI or styling changes only |
| `cleaned` | Code restructure with no behavior change |
| `tested` | Adding or updating tests |
| `configured` | Config, dependencies, or tooling |
| `documented` | Documentation only |
| `reverted` | Reverting a previous commit |

### Examples
```bash
git commit -m "added - login-form - email and password validation"
git commit -m "fixed - login-form - submit button not firing"
git commit -m "styled - navbar - spacing on mobile breakpoint"
git commit -m "cleaned - auth-store - migrated to redux toolkit"
git commit -m "tested - login-hook - unit tests for error states"
git commit -m "configured - prettier - applied formatting across all files"
git commit -m "documented - readme - updated daily workflow rules"
```

### Rules
- Keep the feature name **lowercase and hyphenated**
- Keep the explanation **short and specific** — one clause, no period
- Always commit **one logical change** at a time so reverting stays clean

---

## Pull Request Format

Every PR must follow this format:
```markdown
## What this PR does
<!-- One or two sentences summarizing the purpose of this PR -->

## Changes
<!-- Bullet list of what was added, modified, or removed -->
-
-
-

## Why
<!-- Explain the reasoning or problem this solves -->

## How to test
<!-- Step-by-step instructions to manually verify the changes -->
1.
2.
3.

## Notes
<!-- Optional: edge cases, follow-ups, or things reviewers should watch out for -->
```

---

## Full Example Workflow
```bash
# 1. Update dev
git checkout dev
git pull origin dev

# 2. Create your branch
git checkout -b login-form

# 3. Do your work, then stage changes
git add .

# 4. Commit with convention
git commit -m "feat - login-form - add email and password validation"

# 5. Push branch
git push origin login-form

# 6. Open a Pull Request on GitHub
```

---

## Reverting a Branch to a Specific Commit

> ⚠️ Only do this on your **own branch**. Only use this in **emergencies**.

**Step 1 — Find the commit ID:**
```bash
git log --oneline
```

**Step 2 — Reset to that commit and force push:**
```bash
git reset --hard <commit-id>
git push origin <branch-name> --force
```