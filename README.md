# odgit - Retro Git TUI Dashboard

A clean, minimal, high-performance terminal git interface with a dark retro aesthetic. No emojis, no bloat—just pure terminal excellence.

## ✨ Features

- **Retro Aesthetic** - ASCII art title, cyan/magenta gradient colors, dark background
- **Zero Re-render Loop** - Single render architecture, ultra-fast performance
- **Smart Workflow** - Commit auto-stages files first (no extra step)
- **AI Commit Messages** - Generate conventional commits from git diff (apifreellm.com)
- **Full Git Control** - 13 essential git operations in one place
- **Keyboard-Only** - Arrow keys + Enter, no mouse needed
- **First Launch Wizard** - Painless API key setup
- **Clean UX** - No emojis, text-only, retro dark UI

## 🎮 Installation

```bash
# Install globally
npm install -g odgit

# Or run locally
cd odgit && npm start
```

## 📖 Usage

```bash
odgit
```

### Layout

```
┌────────────────┐  ODGIT v1.0
│ ▸ status       │
│   stage        │  Branch: main | Status: clean
│   commit       │  ─────────────────────────────
│   gen msg      │
│   push         │  Ready
│   pull         │
│   log          │
│   branch       │
│   stash        │
│   pop stash    │
│   discard      │
│   help         │  ? = help · q = quit · ↑↓ navigate · Enter execute
│   quit         │
└────────────────┘
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑↓` | Navigate menu |
| `Enter` | Execute action |
| `?` | Show help |
| `q` | Quit |
| `Backspace` | Delete character (in input mode) |
| `Esc` | Cancel (confirmation/input modes) |

## 📋 Menu Actions

| Action | Description |
|--------|-------------|
| **status** | Show git status with file counts |
| **stage** | Stage all changes |
| **commit** | Auto-stage + enter commit message |
| **gen msg** | Generate commit message from diff (requires API key) |
| **push** | Push to remote (with confirmation) |
| **pull** | Pull from remote (with confirmation) |
| **log** | Show last 5 commits |
| **branch** | Switch to another branch |
| **stash** | Stash current changes |
| **pop stash** | Restore stashed changes |
| **discard** | Discard all unstaged changes (dangerous) |
| **help** | Show keyboard help |
| **quit** | Exit |

## 🚀 Smart Features

### Commit Auto-Staging
Select "commit" → type message → auto-stages and commits. One action, two operations.

### AI Commit Messages
```
1. Select "gen msg"
2. App detects git diff (staged + unstaged)
3. Sends to apifreellm.com (free API)
4. Shows generated conventional commit
5. You can edit or accept
```

### First Launch API Setup
On first run, odgit checks for API key. If missing:
```
Welcome to ODGIT!

Optional: Set API key for AI commit messages
Get free key: https://apifreellm.com

API Key: _
```
Press Esc to skip or Enter to save.

## 🏗️ Project Structure

```
odgit/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── app.tsx               # Main app component
│   ├── utils/
│   │   ├── git.ts            # Git command wrapper
│   │   ├── api.ts            # AI API client
│   │   ├── config.ts         # .env + API key management
│   │   ├── colors.ts         # Styling + formatting
│   │   └── render.ts         # ASCII art rendering
│   └── types/
│       └── index.ts          # TypeScript interfaces
├── dist/                     # Compiled output
├── package.json
├── tsconfig.json
├── README.md
└── LAYOUT.md                 # UI layout reference
```

## 🛠️ Building

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run
npm start

# Run in watch mode (for development)
npm run dev
```

## 🎨 Design Philosophy

- **Text-Only UI** - No emojis, no distracting visuals
- **Single Render** - Component renders once per state change, not continuously
- **Retro Aesthetic** - Cyan/magenta gradients, dark background (#0a0a0f)
- **Keyboard Focused** - Arrows + Enter, no mouse required
- **Smart Defaults** - Commit auto-stages, confirmations protect against mistakes
- **No Bloat** - Only essential git operations, clean UI

## 📦 Dependencies

- **ink** - React terminal UI framework
- **react** - Component model
- **execa** - Execute git commands
- **chalk** - Terminal colors (hex support)
- **gradient-string** - Color gradients
- **figlet** - ASCII art text
- **dotenv** - Environment configuration

## ⚙️ Configuration

The app stores API keys in `.env`:
```
APIFREELLM_KEY=sk_YOUR_KEY_HERE
```

To change the API key, select "genkey" from the menu and enter a new one.

## 🐛 Troubleshooting

**"Raw mode not supported"** - This error only appears in non-TTY environments (GitHub, CI/CD, etc.). The app works fine in a real terminal.

**"No git repository"** - Make sure you're in a git project directory. Run `git init` first if needed.

**"API key invalid"** - Get a free key from https://apifreellm.com and set it via the "genkey" menu.

## 📝 License

MIT

## 🎯 Version

v1.0.0 - Initial release

---

Built with ♡ using TypeScript + Ink

