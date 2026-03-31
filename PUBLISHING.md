# Publishing odgit to npm & GitHub

This guide explains how to publish odgit so users can install it globally with `npm install -g odgit`.

## Step 1: GitHub Setup

### Create a GitHub Repository

1. **Go to GitHub** → https://github.com/new
2. **Repository name:** `odgit`
3. **Description:** Beautiful retro git TUI dashboard
4. **Visibility:** Public
5. **Skip initializing** (we already have files)
6. **Click → Create repository**

### Push Code to GitHub

```bash
# In the odgit directory
cd /c/Users/Hamza\ OUADOUD/Desktop/Projects/odgit

# Initialize git (if not done)
git init

# Add remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/odgit.git

# Rename branch to main (if needed)
git branch -m main

# Push everything
git push -u origin main
```

### Update package.json with Your GitHub URL

Edit `package.json`:
```json
"repository": {
  "type": "git",
  "url": "https://github.com/YOUR-USERNAME/odgit"
},
"homepage": "https://github.com/YOUR-USERNAME/odgit#readme",
"bugs": {
  "url": "https://github.com/YOUR-USERNAME/odgit/issues"
}
```

Replace `YOUR-USERNAME` with your actual GitHub username.

---

## Step 2: NPM Account Setup

### Create npm Account

Go to → https://www.npmjs.com/signup

- Email: your email
- Username: pick a unique name (can be same as GitHub username or different)
- Password: strong password

Verify email.

### Login Locally

```bash
npm login
```

Then:
- **Username:** Your npm username
- **Password:** Your npm password
- **Email:** Your email

(You'll see a verification code request, complete it)

---

## Step 3: Publish to npm

### Before Publishing - Final Checks

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Verify dist/ folder exists:**
   ```bash
   ls dist/
   # Should show: app.js, index.js, utils/, types/
   ```

3. **Test local install:**
   ```bash
   npm install -g .
   odgit
   # Should launch odgit
   ```

4. **Update version** (if re-publishing):
   ```bash
   # Edit package.json version: "1.0.0" → "1.0.1"
   npm version patch
   ```

### Publish

```bash
npm publish
```

If successful, you'll see:
```
+ odgit@1.0.0
```

---

## Step 4: Users Can Install

Now anyone can install odgit globally:

```bash
npm install -g odgit
```

Then run from anywhere:
```bash
odgit
```

---

## Updating in the Future

### When You Make Changes

1. **Build:**
   ```bash
   npm run build
   ```

2. **Commit & Push to GitHub:**
   ```bash
   git add -A
   git commit -m "feat: add new feature"
   git push
   ```

3. **Bump version:**
   ```bash
   npm version patch   # 1.0.0 → 1.0.1 (bug fix)
   npm version minor   # 1.0.0 → 1.1.0 (new feature)
   npm version major   # 1.0.0 → 2.0.0 (breaking change)
   ```

4. **Publish:**
   ```bash
   npm publish
   ```

---

## Verify Installation

After publishing, test that installation works:

```bash
# In a different directory
mkdir ~/test-odgit && cd ~/test-odgit

# Install
npm install -g odgit

# Run from anywhere
odgit --version  # If you add --version support
odgit            # Launch app
```

---

## Add Version Flag (Optional)

Make odgit support `--version`:

Edit `src/index.ts`:
```typescript
#!/usr/bin/env node

import React from 'react';
import { render } from 'ink';
import App from './app.js';
import { loadEnv } from './utils/config.js';

// Check for --version flag
if (process.argv.includes('--version')) {
  console.log('odgit v1.0.0');
  process.exit(0);
}

// Load environment variables from .env
loadEnv();

// Render the app
render(React.createElement(App));
```

---

## Troubleshooting

### "npm ERR! 403 Forbidden"
- Check npm username is correct: `npm whoami`
- Ensure you're logged in: `npm login`

### "Package already exists"
- Change version number in `package.json`
- Run `npm version patch`

### "odgit not found after npm install -g"
- Verify `dist/index.js` exists and has executable permissions
- Check `package.json` has `"bin": { "odgit": "./dist/index.js" }`
- Try: `npm cache clean --force` then reinstall

### Need to change package name
- Edit `package.json` name field
- Delete dist/ folder
- Run `npm run build` again
- Publish with new name

---

## GitHub Actions (Auto-Publish) - Optional

If you want to auto-publish on new releases:

Create `.github/workflows/publish.yml`:
```yaml
name: publish

on:
  release:
    types: [created]

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

Then add NPM_TOKEN to GitHub secrets.

---

## Quick Checklists

### Before First Publish
- [ ] GitHub repo created
- [ ] Code pushed to GitHub
- [ ] npm account created
- [ ] `npm login` done locally
- [ ] `package.json` has correct name
- [ ] `package.json` has "bin" entry
- [ ] `src/index.ts` has shebang `#!/usr/bin/env node`
- [ ] `npm run build` succeeds
- [ ] `npm install -g .` works locally

### For Each Update
- [ ] Changes committed & tested
- [ ] `npm run build` succeeds
- [ ] Version bumped (`npm version patch`)
- [ ] `git push` to GitHub
- [ ] `npm publish`

---

## Summary

```bash
# First time setup
npm login
git remote add origin https://github.com/YOUR-USERNAME/odgit
git push -u origin main
npm publish

# Later updates
git add -A
git commit -m "your changes"
npm version patch
git push
npm publish
```

Done! odgit is now available for everyone.
