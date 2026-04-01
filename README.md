# odgit - Retro Git TUI Dashboard

A beautiful, keyboard-driven git interface with a dark retro aesthetic. Fast, minimal, no bloat.

```
┌────────────────┐
│ ▸ status       │          === ODGIT v1.0 ===
│   stage        │
│   commit       │          Branch: main | Status: clean
│   gen msg      │
│   push         │          Ready
│   pull         │
│   log          │
│   branch       │
│   stash        │
│   pop stash    │
│   discard      │
│   help         │          ? = help · q = quit · ↑↓ navigate
│   quit         │
└────────────────┘
```

---

## 🎯 What is odgit?

A **git dashboard in your terminal** that lets you:
- See git status instantly
- Stage, commit, push, pull with just arrow keys
- Generate commit messages using AI
- Manage branches, stash, and view logs
- All without touching the mouse

**Fast. Minimal. Retro.**

---

## ⚡ Quick Start

### Install (One Command)

```bash
npm install -g @hamzaod/odgit
```

### Run (Type Anywhere)

```bash
odgit
```

Done! 🚀

---

## 🎮 How to Use

**Keyboard only. That's it.**

| Key | What It Does |
|-----|--------------|
| `↑` `↓` | Move up/down in menu |
| `Enter` | Do the selected action |
| `?` | Show help |
| `q` | Quit |
| `r` | Refresh |

### Example Workflow

```
1. Type: odgit
2. Edit some files in your project
3. Press ↓ to select "commit"
4. Press Enter
5. Type your commit message
6. Press Enter
7. Done! Files auto-staged and committed
```

---

## 📋 What You Can Do

| Action | What It Does |
|--------|-------------|
| **status** | See all modified files |
| **stage** | Mark files to commit |
| **commit** | Stage everything + write message |
| **gen msg** | AI generates commit message for you |
| **push** | Send commits to GitHub |
| **pull** | Get latest from GitHub |
| **log** | See recent commits |
| **branch** | Switch to another branch |
| **stash** | Save work temporarily |
| **pop stash** | Get saved work back |
| **discard** | Throw away changes (whoops!) |

---

## 🤖 AI Commit Messages (Optional)

odgit can auto-generate commit messages using AI:

```
1. Select "gen msg"
2. Press Enter
3. Wait 2 seconds
4. See: "feat(auth): add login function"
5. Edit or confirm
```

**How to enable:**
- On first launch, paste your free API key from https://apifreellm.com
- Or type `genkey` later to add it

---

## ❓ FAQ

### Q: I ran `npm install -g @hamzaod/odgit`. Can I now type `odgit` from anywhere?

**A: Yes!** After `npm install -g @hamzaod/odgit`, the `odgit` command works in any terminal, any directory. Just type:

```bash
odgit
```

It works because npm puts it in your PATH. No extra setup needed.

### Q: Do I need to be in a git project?

**A: Yes.** odgit only works inside git repositories. If you're not in one, run `git init` first.

### Q: Where does odgit save my API key?

**A: In `.env` file** in your home directory. It's never uploaded to GitHub or sent anywhere except to apifreellm.com for generating messages.

### Q: Can I use odgit without the AI feature?

**A: Absolutely.** Just skip the API key setup on first launch (press Esc). You can use all other features normally.

### Q: What if I mess up my code with "discard"?

**A: Be careful!** "discard" deletes all changes. Use it only when you're sure. Odgit asks for confirmation before doing it.

### Q: How do I update odgit?

**A: Same command:**

```bash
npm install -g @hamzaod/odgit
```

npm automatically updates to the latest version.

### Q: Can I use this on Windows / Mac / Linux?

**A: Yes!** Works on all three. You just need Node.js 18+.

### Q: I got an error "Raw mode not supported"

**A: You're probably in a non-interactive terminal** (GitHub Actions, Docker, etc.). odgit needs a real terminal to work. Try running locally instead.

### Q: Where can I report bugs?

**A: GitHub Issues:** https://github.com/yourusername/odgit/issues

---

## 🎨 Why Is It Different?

- **No mouse** - Pure keyboard, super fast
- **No clutter** - Just what you need
- **Retro look** - Cyan/magenta, dark background
- **Smart features** - Auto-stages before commit
- **AI integration** - Free conventional commits
- **Single render** - Ultra-fast, no lag

---

## 🔧 Troubleshooting

**"odgit: command not found"**
```bash
npm install -g @hamzaod/odgit
```

**"No git repository"**
```bash
git init
```

**"API key invalid"**
- Get a free key: https://apifreellm.com
- Run: Select "genkey" from menu

**"Terminal looks weird"**
- Try a different terminal app
- Make sure terminal supports 256+ colors

---

## 📖 Learn More

- **Quick Start:** See QUICKSTART.md
- **Installation:** See package.json
- **Contributing:** Pull requests welcome!

---

## 📝 License

MIT - Use however you want

---

## 🙋 Support

Questions? Open an issue on GitHub or check QUICKSTART.md for more help.

---

## 📦 Package

**npm:** https://www.npmjs.com/package/@hamzaod/odgit
**GitHub:** https://github.com/hamzaODprogramer/odgit

Install with:
```bash
npm install -g @hamzaod/odgit
```

**Happy committing!** 🚀
