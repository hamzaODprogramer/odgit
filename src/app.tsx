import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import { colors, clearScreen } from './utils/colors.js';
import { renderTitle, renderSubtitle } from './utils/render.js';
import { hasAPIKey, saveAPIKey, getAPIKey } from './utils/config.js';
import {
  getStatus,
  stageAll,
  commit,
  push,
  pull,
  stash,
  stashPop,
  restore,
  checkout,
  getLog,
  getBranches,
  getDiff,
} from './utils/git.js';
import { generateCommitMessage } from './utils/api.js';
import { GitStatus, GitLog } from './types/index.js';

type AppMode = 'splash' | 'apikey' | 'menu' | 'confirm' | 'input' | 'select' | 'help' | 'view';

interface AppState {
  mode: AppMode;
  selectedAction: number;
  selectedIndex: number; // for select/branch/status list
  gitStatus: GitStatus | null;
  confirmTitle: string;
  confirmDesc: string;
  inputPrompt: string;
  inputValue: string;
  error: string;
  lastAction: string;
  displayData: string; // for log/status display
  selectOptions: string[]; // for branch selection
  logs: GitLog[]; // store for display
}

const MENU_ITEMS = [
  { id: 'status',   label: 'status',   desc: 'Show changes' },
  { id: 'stage',    label: 'stage',    desc: 'Stage all' },
  { id: 'commit',   label: 'commit',   desc: 'Stage + commit' },
  { id: 'genai',    label: 'gen msg',  desc: 'Generate AI msg' },
  { id: 'push',     label: 'push',     desc: 'Push remote' },
  { id: 'pull',     label: 'pull',     desc: 'Pull remote' },
  { id: 'log',      label: 'log',      desc: 'Recent commits' },
  { id: 'branch',   label: 'branch',   desc: 'Switch branch' },
  { id: 'stash',    label: 'stash',    desc: 'Stash changes' },
  { id: 'pop',      label: 'pop stash',desc: 'Restore stash' },
  { id: 'discard',  label: 'discard',  desc: 'Discard all' },
  { id: 'refresh',  label: 'refresh',  desc: 'Refresh status' },
  { id: 'help',     label: 'help',     desc: 'Show help' },
  { id: 'quit',     label: 'quit',     desc: 'Exit' },
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    mode: 'splash',
    selectedAction: 0,
    selectedIndex: 0,
    gitStatus: null,
    confirmTitle: '',
    confirmDesc: '',
    inputPrompt: '',
    inputValue: '',
    error: '',
    lastAction: 'Loading...',
    displayData: '',
    selectOptions: [],
    logs: [],
  });

  // Splash screen - 1.2s then check API key
  useEffect(() => {
    clearScreen();
    const timer = setTimeout(() => {
      const hasKey = hasAPIKey();
      setState(prev => ({
        ...prev,
        mode: hasKey ? 'menu' : 'apikey',
      }));
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Auto-load git status when in menu
  useEffect(() => {
    if (state.mode === 'menu') {
      reloadGitStatus();
    }
  }, [state.mode]);

  const reloadGitStatus = async () => {
    try {
      const result = await getStatus();
      setState(prev => ({
        ...prev,
        gitStatus: result.success ? result.data || null : null,
        lastAction: result.success ? 'Ready' : 'Error loading status',
      }));
    } catch (err) {
      // ignored
    }
  };

  const handleAction = useCallback(async (actionId: string) => {
    switch (actionId) {
      case 'refresh':
        await reloadGitStatus();
        setState(prev => ({
          ...prev,
          lastAction: 'Status refreshed',
        }));
        break;

      case 'status':
        const status = await getStatus();
        if (status.success && status.data) {
          const files = [
            ...status.data.staged.map(f => `[S] ${f.path}`),
            ...status.data.unstaged.map(f => `[U] ${f.path}`),
            ...status.data.untracked.map(f => `[?] ${f.path}`),
          ];
          setState(prev => ({
            ...prev,
            mode: 'view' as const,
            displayData: files.length > 0 ? files.join('\n') : 'No changes',
            lastAction: `${files.length} files`,
          }));
        }
        break;

      case 'stage':
        const stageResult = await stageAll();
        setState(prev => ({
          ...prev,
          lastAction: stageResult.success ? 'All staged' : 'Stage failed',
          error: stageResult.error || '',
        }));
        await reloadGitStatus();
        break;

      case 'commit':
        await stageAll();
        setState(prev => ({
          ...prev,
          mode: 'input' as const,
          inputPrompt: 'Commit message:',
          inputValue: '',
        }));
        break;

      case 'genai':
        setState(prev => ({ ...prev, lastAction: 'Generating...', error: '' }));
        try {
          const apiKey = getAPIKey();
          if (!apiKey) {
            setState(prev => ({
              ...prev,
              error: 'No API key. Select "refresh" then use genkey',
              lastAction: 'API key required',
            }));
            break;
          }

          const diff = await getDiff(false);
          const diffCached = await getDiff(true);
          const fullDiff = (diff.output || '') + '\n' + (diffCached.output || '');

          if (!fullDiff.trim()) {
            setState(prev => ({
              ...prev,
              error: 'No changes to generate from',
              lastAction: 'Nothing to commit',
            }));
            break;
          }

          const result = await generateCommitMessage(fullDiff, apiKey);
          if (result.success && result.message) {
            setState(prev => ({
              ...prev,
              mode: 'input' as const,
              inputPrompt: 'Generated commit message (edit if needed):',
              inputValue: result.message || '',
              lastAction: 'Message generated',
              error: '',
            }));
          } else {
            setState(prev => ({
              ...prev,
              error: result.error || 'Failed to generate',
              lastAction: 'Generation failed',
            }));
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Unknown error';
          setState(prev => ({
            ...prev,
            error: 'Network error or invalid API key',
            lastAction: 'Generation error: ' + msg.substring(0, 30),
          }));
        }
        break;

      case 'push':
        setState(prev => ({
          ...prev,
          mode: 'confirm' as const,
          confirmTitle: 'PUSH TO REMOTE?',
          confirmDesc: 'This will push your commits upstream',
        }));
        break;

      case 'pull':
        setState(prev => ({
          ...prev,
          mode: 'confirm' as const,
          confirmTitle: 'PULL FROM REMOTE?',
          confirmDesc: 'Fetch and merge changes',
        }));
        break;

      case 'log':
        const logs = await getLog(10);
        if (logs.success && logs.data) {
          const logLines = logs.data.map(l => `${l.hash}  ${l.message}  (${l.author})`);
          setState(prev => ({
            ...prev,
            mode: 'view' as const,
            displayData: logLines.join('\n'),
            logs: logs.data || [],
            lastAction: 'Log loaded',
          }));
        } else {
          setState(prev => ({
            ...prev,
            error: 'Failed to load log',
            lastAction: 'Log error',
          }));
        }
        break;

      case 'branch':
        const branches = await getBranches();
        if (branches.success && branches.data) {
          setState(prev => ({
            ...prev,
            mode: 'select' as const,
            selectOptions: branches.data || [],
            selectedIndex: 0,
            lastAction: 'Select branch',
          }));
        } else {
          setState(prev => ({
            ...prev,
            error: 'Failed to load branches',
            lastAction: 'Branch error',
          }));
        }
        break;

      case 'stash':
        setState(prev => ({
          ...prev,
          mode: 'confirm' as const,
          confirmTitle: 'STASH CHANGES?',
          confirmDesc: 'Save current work to stash',
        }));
        break;

      case 'pop':
        setState(prev => ({
          ...prev,
          mode: 'confirm' as const,
          confirmTitle: 'RESTORE STASHED CHANGES?',
          confirmDesc: 'Pop from stash',
        }));
        break;

      case 'discard':
        setState(prev => ({
          ...prev,
          mode: 'confirm' as const,
          confirmTitle: 'DISCARD ALL CHANGES?',
          confirmDesc: 'WARNING: This cannot be undone',
        }));
        break;

      case 'help':
        setState(prev => ({
          ...prev,
          mode: 'help' as const,
        }));
        break;

      case 'quit':
        process.exit(0);
    }
  }, []);

  const handleConfirm = useCallback(async (confirmed: boolean) => {
    if (!confirmed) {
      setState(prev => ({ ...prev, mode: 'menu' as const }));
      return;
    }

    const selectedId = MENU_ITEMS[state.selectedAction]?.id;

    if (selectedId === 'push') {
      const result = await push();
      setState(prev => ({
        ...prev,
        mode: 'menu' as const,
        lastAction: result.success ? 'Pushed!' : (result.error || 'Push failed'),
        error: '',
      }));
    } else if (selectedId === 'pull') {
      const result = await pull();
      setState(prev => ({
        ...prev,
        mode: 'menu' as const,
        lastAction: result.success ? 'Pulled!' : (result.error || 'Pull failed'),
        error: '',
      }));
      await reloadGitStatus();
    } else if (selectedId === 'stash') {
      const result = await stash();
      setState(prev => ({
        ...prev,
        mode: 'menu' as const,
        lastAction: result.success ? 'Stashed!' : (result.error || 'Stash failed'),
        error: '',
      }));
      await reloadGitStatus();
    } else if (selectedId === 'pop') {
      const result = await stashPop();
      setState(prev => ({
        ...prev,
        mode: 'menu' as const,
        lastAction: result.success ? 'Restored!' : (result.error || 'Pop failed'),
        error: '',
      }));
      await reloadGitStatus();
    } else if (selectedId === 'discard') {
      const result = await restore();
      setState(prev => ({
        ...prev,
        mode: 'menu' as const,
        lastAction: result.success ? 'Discarded!' : (result.error || 'Failed'),
        error: '',
      }));
      await reloadGitStatus();
    }
  }, [state.selectedAction]);

  const handleInput = useCallback(async (text: string) => {
    const selectedId = MENU_ITEMS[state.selectedAction]?.id;

    if (selectedId === 'commit') {
      if (!text.trim()) {
        setState(prev => ({ ...prev, mode: 'menu' as const }));
        return;
      }
      const result = await commit(text);
      setState(prev => ({
        ...prev,
        mode: 'menu' as const,
        lastAction: result.success ? 'Committed!' : (result.error || 'Failed'),
        error: '',
      }));
      await reloadGitStatus();
    } else if (selectedId === 'genai') {
      if (!text.trim()) {
        setState(prev => ({ ...prev, mode: 'menu' as const }));
        return;
      }
      const result = await commit(text);
      setState(prev => ({
        ...prev,
        mode: 'menu' as const,
        lastAction: result.success ? 'Committed!' : (result.error || 'Failed'),
        error: '',
      }));
      await reloadGitStatus();
    }
  }, [state.selectedAction]);

  const handleBranchSelect = useCallback(async (branchName: string) => {
    const result = await checkout(branchName);
    setState(prev => ({
      ...prev,
      mode: 'menu' as const,
      lastAction: result.success ? `Switched: ${branchName}` : (result.error || 'Failed'),
      error: '',
    }));
    await reloadGitStatus();
  }, []);

  useInput((input, key) => {
    if (state.mode === 'splash') return;

    if (state.mode === 'apikey') {
      if (key.return) {
        if (state.inputValue.trim()) {
          saveAPIKey(state.inputValue.trim());
          setState(prev => ({
            ...prev,
            mode: 'menu' as const,
            inputValue: '',
            lastAction: 'API key saved',
          }));
          reloadGitStatus();
        } else {
          // Allow empty to skip
          setState(prev => ({
            ...prev,
            mode: 'menu' as const,
            inputValue: '',
          }));
        }
      } else if (key.escape) {
        setState(prev => ({
          ...prev,
          mode: 'menu' as const,
          inputValue: '',
        }));
      } else if (key.backspace || key.delete) {
        setState(prev => ({
          ...prev,
          inputValue: prev.inputValue.slice(0, -1),
        }));
      } else if (input && !key.ctrl && !key.meta && !key.shift) {
        setState(prev => ({
          ...prev,
          inputValue: prev.inputValue + input,
        }));
      }
      return;
    }

    if (state.mode === 'menu') {
      if (key.upArrow) {
        setState(prev => ({
          ...prev,
          selectedAction: prev.selectedAction === 0 ? MENU_ITEMS.length - 1 : prev.selectedAction - 1,
        }));
      } else if (key.downArrow) {
        setState(prev => ({
          ...prev,
          selectedAction: prev.selectedAction === MENU_ITEMS.length - 1 ? 0 : prev.selectedAction + 1,
        }));
      } else if (key.return) {
        handleAction(MENU_ITEMS[state.selectedAction].id);
      } else if (input === '?') {
        setState(prev => ({ ...prev, mode: 'help' as const }));
      } else if (input === 'r' || input === 'R') {
        reloadGitStatus();
      } else if (input === 'q') {
        process.exit(0);
      }
    } else if (state.mode === 'help') {
      setState(prev => ({ ...prev, mode: 'menu' as const }));
    } else if (state.mode === 'view') {
      setState(prev => ({ ...prev, mode: 'menu' as const }));
    } else if (state.mode === 'select') {
      if (key.upArrow) {
        setState(prev => ({
          ...prev,
          selectedIndex: Math.max(0, prev.selectedIndex - 1),
        }));
      } else if (key.downArrow) {
        setState(prev => ({
          ...prev,
          selectedIndex: Math.min(state.selectOptions.length - 1, prev.selectedIndex + 1),
        }));
      } else if (key.return) {
        handleBranchSelect(state.selectOptions[state.selectedIndex]);
      } else if (key.escape) {
        setState(prev => ({ ...prev, mode: 'menu' as const, selectedIndex: 0 }));
      }
    } else if (state.mode === 'confirm') {
      if (input === 'y' || input === 'Y') {
        handleConfirm(true);
      } else if (input === 'n' || input === 'N' || key.escape) {
        handleConfirm(false);
      }
    } else if (state.mode === 'input') {
      if (key.return) {
        handleInput(state.inputValue);
      } else if (key.escape) {
        setState(prev => ({
          ...prev,
          mode: 'menu' as const,
          inputValue: '',
        }));
      } else if (key.backspace || key.delete) {
        setState(prev => ({
          ...prev,
          inputValue: prev.inputValue.slice(0, -1),
        }));
      } else if (input && !key.ctrl && !key.meta && !key.shift) {
        setState(prev => ({
          ...prev,
          inputValue: prev.inputValue + input,
        }));
      }
    } else if (state.mode === 'apikey') {
      if (key.return) {
        if (state.inputValue.trim()) {
          saveAPIKey(state.inputValue.trim());
          setState(prev => ({
            ...prev,
            mode: 'menu' as const,
            inputValue: '',
            lastAction: 'API key saved',
          }));
          reloadGitStatus();
        }
      } else if (key.escape) {
        setState(prev => ({
          ...prev,
          mode: 'menu' as const,
          inputValue: '',
        }));
      } else if (key.backspace) {
        setState(prev => ({
          ...prev,
          inputValue: prev.inputValue.slice(0, -1),
        }));
      } else if (input && !key.ctrl && !key.meta) {
        setState(prev => ({
          ...prev,
          inputValue: prev.inputValue + input,
        }));
      }
    }
  });

  // SPLASH SCREEN
  if (state.mode === 'splash') {
    return (
      <Box flexDirection="column">
        <Text>{renderTitle()}</Text>
        <Box marginTop={1}>
          <Text>{renderSubtitle()}</Text>
        </Box>
      </Box>
    );
  }

  // API KEY SETUP
  if (state.mode === 'apikey') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text>{colors.title('Welcome to ODGIT!')}</Text>
        </Box>
        <Text>{colors.cyan('Optional: Set API key for AI commit messages')}</Text>
        <Text dimColor>Get free key: https://apifreellm.com</Text>
        <Box marginTop={1} marginBottom={1}>
          <Text>{colors.magenta('API Key: ' + state.inputValue + '_')}</Text>
        </Box>
        <Text dimColor>Enter key, press Esc to skip, Enter to save</Text>
      </Box>
    );
  }

  // HELP OVERLAY
  if (state.mode === 'help') {
    return (
      <Box flexDirection="column">
        <Text>{colors.title('ODGIT HELP')}</Text>
        <Box marginTop={1} marginBottom={1}>
          <Text>{colors.cyan('KEYBOARD:')}</Text>
        </Box>
        <Text>  ↑↓    Navigate menu</Text>
        <Text>  Enter Execute action</Text>
        <Text>  r     Refresh status</Text>
        <Text>  ?     Toggle help</Text>
        <Text>  q     Quit</Text>
        <Box marginTop={1}>
          <Text dimColor>Press any key to return...</Text>
        </Box>
      </Box>
    );
  }

  // VIEW SCREEN (log, status)
  if (state.mode === 'view') {
    const lines = state.displayData.split('\n').slice(0, 15);
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text>{colors.white(state.lastAction.toUpperCase())}</Text>
        </Box>
        {lines.map((line, i) => (
          <Text key={i} dimColor>
            {line}
          </Text>
        ))}
        <Box marginTop={1}>
          <Text dimColor>Press any key to close...</Text>
        </Box>
      </Box>
    );
  }

  // SELECT SCREEN (branches)
  if (state.mode === 'select') {
    return (
      <Box flexDirection="column">
        <Text>{colors.cyan('Select branch:')}</Text>
        <Box marginTop={1} marginBottom={1} flexDirection="column">
          {state.selectOptions.map((option, idx) => {
            const isSelected = idx === state.selectedIndex;
            const prefix = isSelected ? colors.magenta('>> ') : '   ';
            const text = isSelected ? colors.cyan(option) : colors.muted(option);
            return (
              <Text key={idx}>
                {prefix}{text}
              </Text>
            );
          })}
        </Box>
        <Text dimColor>↑↓ navigate · Enter select · Esc cancel</Text>
      </Box>
    );
  }

  // CONFIRM SCREEN
  if (state.mode === 'confirm') {
    return (
      <Box flexDirection="column">
        <Text>{colors.magenta(state.confirmTitle)}</Text>
        <Text dimColor>{state.confirmDesc}</Text>
        <Box marginTop={1}>
          <Text>
            {colors.cyan('y')} = yes  {colors.gray('·')}  {colors.cyan('n')} = no
          </Text>
        </Box>
      </Box>
    );
  }

  // INPUT SCREEN
  if (state.mode === 'input') {
    return (
      <Box flexDirection="column">
        <Text>{colors.cyan(state.inputPrompt)}</Text>
        <Box marginTop={1} marginBottom={1}>
          <Text>{colors.magenta('> ' + state.inputValue + '_')}</Text>
        </Box>
        <Text dimColor>Enter submit · Esc cancel · Backspace delete</Text>
      </Box>
    );
  }

  // MAIN MENU SCREEN
  const fileCount =
    (state.gitStatus?.staged.length || 0) +
    (state.gitStatus?.unstaged.length || 0) +
    (state.gitStatus?.untracked.length || 0);
  const statusStr = fileCount > 0 ? `${fileCount} files pending` : 'working tree clean';
  const branch = state.gitStatus?.currentBranch || '?';

  return (
    <Box flexDirection="row">
      {/* LEFT SIDEBAR */}
      <Box flexDirection="column" width={20} paddingRight={1}>
        <Box marginBottom={1}>
          <Text>{colors.cyan('┌────────────────┐')}</Text>
        </Box>
        {MENU_ITEMS.map((item, idx) => {
          const isSelected = idx === state.selectedAction;
          const marker = isSelected ? colors.cyan('▸ ') : '  ';
          const label = isSelected
            ? colors.cyan(item.label)
            : colors.muted(item.label);
          return (
            <Text key={idx}>
              {marker}{label}
            </Text>
          );
        })}
        <Box marginTop={1}>
          <Text>{colors.cyan('└────────────────┘')}</Text>
        </Box>
      </Box>

      {/* RIGHT CONTENT */}
      <Box flexDirection="column" flexGrow={1}>
        <Box marginBottom={1}>
          <Text>{colors.title('ODGIT v1.0')}</Text>
        </Box>

        <Box marginBottom={1} flexDirection="row">
          <Text>
            {colors.cyan('Branch:')} {colors.white(branch)} {' '} {colors.cyan('Status:')} {colors.green(statusStr)}
          </Text>
        </Box>

        <Box marginBottom={1}>
          <Text>{colors.muted('─'.repeat(50))}</Text>
        </Box>

        <Box flexDirection="column" marginBottom={1}>
          <Text>{colors.white(state.lastAction)}</Text>
          {state.error && <Text>{colors.red('ERROR: ' + state.error)}</Text>}
        </Box>

        <Box marginTop={1}>
          <Text dimColor>? help · r refresh · q quit · ↑↓ nav · Enter select</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
