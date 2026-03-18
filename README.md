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

### 1. Pull the latest main
Always make sure your local main is up to date before creating a branch.
```bash
git checkout main
git pull origin main
```

### 2. Create a new branch
Create your branch from main using this naming convention:
```
{feature-name}
```

**Example:**
```bash
git checkout -b login-form
```

**Examples:**
```
JD/login-form
SA/profile-header
MK/audio-upload
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
- Add a clear title and description of what you did
- Request a review from a teammate
- Do **not** merge your own PR

---

## Commit Convention

Every commit must follow this structure:

```
[INITIALS] - [feature] - [v{version}]
```

| Part | Description | Example |
|------|-------------|---------|
| `INITIALS` | First + Last name initials (uppercase) | `OM` |
| `feature` | Short description of what was done | `login-form` |
| `version` | Simple version number | `v1` |

### Examples
OM: Omar Mahmoud
```bash
git commit -m "OM - login-form - v1"
git commit -m "OM - register-form - v1"
git commit -m "OM - login-form - v2"
git commit -m "OM - profile-header - v1"
```

### Rules
- Increment the version (`v2`, `v3`...) when you update the same feature
- Keep the feature name **lowercase and hyphenated**
- Always commit **one logical change** at a time (so that if needed to revert a change, it won't be large)

---

## Full Example Workflow

```bash
# 1. Update main
git checkout main
git pull origin main

# 2. Create your branch
git checkout -b login-form

# 3. Do your work, then stage changes
git add .

# 4. Commit with convention
git commit -m "OM - login-form - v1"

# 5. Push branch
git push origin login-form

# 6. Open a Pull Request on GitHub
```



---
##
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
