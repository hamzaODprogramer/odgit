/**
 * ODGIT Layout Preview (what you see when running the app)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                            ║
 * ║     ___  ____   ____ ___ _____                                            ║
 * ║    / _ \|  _ \ / ___|_ _|_   _|                                           ║
 * ║   | | | | | | | |  _ | |  | |                                            ║
 * ║   | |_| | |_| | |_| || |  | |                                            ║
 * ║    \___/|____/ \____|___| |_|                                            ║
 * ║                                                                            ║
 * ║   git dashboard · type ? for help                                         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * [After 1.2 seconds, shows main interface]
 *
 * ┌────────────────┐  │ ODGIT v1.0
 * │ ▸ status       │  │
 * │   stage        │  │ Branch: main | Status: 2 files pending
 * │   commit       │  │ ───────────────────────────────────────────
 * │   gen msg      │  │
 * │   push         │  │ Ready
 * │   pull         │  │
 * │   log          │  │
 * │   branch       │  │
 * │   stash        │  │
 * │   pop stash    │  │
 * │   discard      │  │ ? = help · q = quit · ↑↓ = nav · Enter = select
 * │   help         │  │
 * │   quit         │  │
 * └────────────────┘  │
 *
 *
 * TEXT INPUT MODE (for commit message):
 *
 * Commit message:
 * > feat: add user authentication_
 *
 * Enter to submit, Esc to cancel, Backspace to delete
 *
 *
 * CONFIRMATION MODE (for dangerous actions):
 *
 * PUSH TO REMOTE?
 * This will push your commits
 *
 * y = yes  ·  n = no
 *
 *
 * API KEY SETUP (first launch):
 *
 * Welcome to ODGIT!
 *
 * Optional: Set API key for AI commit messages
 * Get free key: https://apifreellm.com
 *
 * API Key: sk-1234567890abcdef_
 *
 * Enter key, press Esc to skip, Enter to save
 */

// Features Implemented:
// ✅ Large gradient ASCII title (figlet ODGIT)
// ✅ 1.2s splash screen before main UI
// ✅ Sidebar menu on left with ▸ selection indicator
// ✅ Main content area on right
// ✅ API key setup wizard on first launch
// ✅ Text input with backspace + Enter
// ✅ Confirmation prompts for dangerous actions
// ✅ Commit message generation from git diff
// ✅ All 13 menu items working
// ✅ Clean retro aesthetic (cyan/magenta)
// ✅ NO emojis
// ✅ NO re-rendering loop
// ✅ Smart commit workflow (auto-stages)
