# odgit - Quick Start Guide

## Install

```bash
npm install -g odgit
```

## Run

```bash
odgit
```

Boom! 🚀

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑↓` | Navigate menu |
| `Enter` | Execute action |
| `?` | Show help |
| `q` | Quit |
| `r` | Refresh |
| `Backspace` | Delete character (in input) |
| `Esc` | Cancel |

---

## Available Actions

```
status     Show git status + file list
stage      Stage all changes
commit     Stage + commit (enter message)
gen msg    Generate AI commit message
push       Push to remote
pull       Pull from remote
log        Show recent commits
branch     Switch branch
stash      Stash changes
pop stash  Restore stashed changes
discard    Discard all changes (dangerous!)
help       Show keyboard help
quit       Exit
```

---

## First Launch

On first launch, you can optionally set up an API key for AI commit message generation:

```
Welcome to ODGIT!

Optional: Set API key for AI commit messages
Get free key: https://apifreellm.com

API Key: _
```

- **Press Enter** to save the key
- **Press Esc** to skip (you can add it later)

To change your API key later, select **"genkey"** from menu.

---

## Common Workflows

### Quick Commit

```
1. Make changes to files
2. Press ↓ to select "commit"
3. Press Enter
4. Type your commit message
5. Press Enter
```

**Note:** "commit" auto-stages all files first!

### Generate Commit Message

```
1. Make changes
2. Press ↓ to select "gen msg"
3. Press Enter
4. Wait for AI to generate message
5. Edit if needed or press Enter to accept
```

### Push to Remote

```
1. Select "push"
2. Press Enter
3. Type 'y' to confirm
4. Watch it push!
```

### Switch Branch

```
1. Select "branch"
2. Press Enter
3. Navigate with ↑↓
4. Press Enter to switch
```

---

## Troubleshooting

**odgit: command not found**
- Try: `npm install -g odgit`
- Or full path: `/usr/local/bin/odgit`

**"Raw mode not supported"** error
- This only happens in non-TTY environments (GitHub CI, etc.)
- Works fine in real terminal

**"No git repository"**
- Make sure you're in a git project
- Run `git init` first if needed

**API key issues**
- Get free key: https://apifreellm.com
- Use "genkey" menu to update it

---

## For Developers

If you want to modify odgit:

```bash
# Clone repo
git clone https://github.com/YOUR-USERNAME/odgit
cd odgit

# Install deps
npm install

# Run in dev mode
npm run dev

# Build
npm run build

# Test globally
npm install -g .
```

---

## Learn More

- Full documentation: See README.md
- Publishing guide: See PUBLISHING.md
- Bug fixes: See BUGFIXES.md
- Design: Check src/utils/colors.ts and src/app.tsx

---

**Made with ♡ - Fast, minimal, retro git dashboa,rd**
