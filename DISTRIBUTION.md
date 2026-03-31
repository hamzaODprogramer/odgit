# odgit Publishing & Distribution Guide

Everything is ready! Here's exactly what to do step by step.

---

## ✅ Pre-Flight Checklist

- [x] Project built (`npm run build` ✓)
- [x] dist/ folder exists with compiled code
- [x] package.json configured for npm
- [x] src/index.ts has shebang `#!/usr/bin/env node`
- [x] .env in .gitignore (API key won't leak)
- [x] LICENSE file created
- [x] README.md and QUICKSTART.md ready
- [x] PUBLISHING.md guide included

---

## 🚀 Step 1: Create GitHub Repo

### Option A: GitHub Web UI (Easiest)

1. Go to https://github.com/new
2. **Repository name:** `odgit`
3. **Description:** Beautiful retro git TUI dashboard
4. **Public** (so others can see it)
5. **Click → Create repository**

### Option B: GitHub CLI

```bash
gh repo create odgit --public --source=. --remote=origin --push
```

---

## 🔗 Step 2: Connect Local Project to GitHub

After creating the repo on GitHub, run in your odgit folder:

```bash
# Add remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/odgit.git

# Rename to main if needed
git branch -m main

# Push all code
git push -u origin main
```

---

## 📝 Step 3: Update package.json

Edit **package.json** and replace:

```json
"author": "Your Name",
"repository": {
  "type": "git",
  "url": "https://github.com/YOUR-USERNAME/odgit"
},
"homepage": "https://github.com/YOUR-USERNAME/odgit#readme",
```

Replace `YOUR-USERNAME` with your actual GitHub username.

Commit this change:

```bash
git add package.json
git commit -m "docs: update github url"
git push
```

---

## 🎯 Step 4: Create npm Account

Go to https://www.npmjs.com/signup

**Sign up with:**
- Email
- Username (can be anything, doesn't have to match GitHub)
- Strong password
- Verify email

---

## 🔑 Step 5: Login to npm Locally

```bash
npm login
```

**Enter:**
- Username: your npm username
- Password: your npm password
- Email: your email

You might get a code sent to email - complete it.

Verify:
```bash
npm whoami
```

Should show your username.

---

## 📦 Step 6: Publish to npm

### Before Publishing

```bash
# Build one more time
npm run build

# Verify dist/ exists
ls dist/

# Test locally first
npm install -g .
odgit
```

### Publish

```bash
npm publish
```

**If successful, you'll see:**
```
+ odgit@1.0.0
```

---

## ✨ Step 7: Verify Installation

Open a new terminal and test from any directory:

```bash
# Install
npm install -g odgit

# Should work from anywhere
cd ~
odgit

# Should open the app!
```

---

## 🎉 Done!

Your package is now live! Share it:

```markdown
# odgit - Beautiful retro git TUI dashboard

Install globally:
```bash
npm install -g odgit
```

Run:
```bash
odgit
```

🔗 **GitHub:** https://github.com/YOUR-USERNAME/odgit
📦 **npm:** https://www.npmjs.com/package/odgit
```

---

## 📈 Future Updates

### When You Make Changes

```bash
# Make changes, commit to git
git add -A
git commit -m "feat: add cool feature"
git push

# Bump version (automatic semver)
npm version patch    # 1.0.0 → 1.0.1 (bug fix)
npm version minor    # 1.0.0 → 1.1.0 (new feature)
npm version major    # 1.0.0 → 2.0.0 (breaking change)

# This auto-tags and pushes to git

# Publish to npm
npm publish
```

---

## 💡 Pro Tips

### Add Keywords for Discovery

Update package.json keywords:
```json
"keywords": [
  "git",
  "cli",
  "tui",
  "terminal",
  "dashboard",
  "retro",
  "dark-mode"
]
```

### Add a README Badge

```markdown
# odgit

[![npm](https://img.shields.io/npm/v/odgit.svg)](https://www.npmjs.com/package/odgit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Beautiful retro git TUI dashboard...
```

### GitHub Release Page

After `npm version` (which creates a tag):

```bash
git push --tags
gh release create v1.0.0 --notes "Initial release"
```

Then users can download from Releases page.

---

## ⚠️ Common Issues

| Problem | Solution |
|---------|----------|
| "npm ERR! 403 Forbidden" | Run `npm whoami` - make sure logged in |
| "odgit: command not found" | Reinstall: `npm install -g odgit` |
| "Package name taken" | Change name in package.json, publish again |
| "node_modules in npm" | Check .gitignore has `node_modules/` |
| "build included in npm" | Check `files` array in package.json (dist only) |

---

## 🔄 CI/CD Setup (Optional)

Auto-publish on GitHub release:

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          registry-url: https://registry.npmjs.org

      - run: npm install
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Then get your npm token: https://www.npmjs.com/settings/~/tokens

Add to GitHub → Settings → Secrets as `NPM_TOKEN`.

Now when you tag: `git tag v1.0.1 && git push --tags`, it auto-publishes!

---

## Summary

```bash
# 1. GitHub Setup
gh repo create odgit --public --push

# 2. npm Setup
npm login

# 3. Publish
npm publish

# 4. Verify
npm install -g odgit
odgit
```

**That's it!** 🚀

Everyone can now use `npm install -g odgit` from anywhere.
