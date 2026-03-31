import { execa } from 'execa';
import { GitStatus, GitLog, GitFile } from '../types/index.js';

export interface GitResult<T = string> {
  success: boolean;
  data?: T;
  output?: string;
  error?: string;
}

export const getStatus = async (): Promise<GitResult<GitStatus>> => {
  try {
    const { stdout: branch } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
    const { stdout: status } = await execa('git', ['status', '--porcelain']);

    const staged: GitFile[] = [];
    const unstaged: GitFile[] = [];
    const untracked: GitFile[] = [];

    status.split('\n').forEach(line => {
      if (!line.trim()) return;

      const code = line.substring(0, 2);
      const filePath = line.substring(3).trim();

      const fileObj: GitFile = {
        path: filePath,
        status: 'unstaged',
        type: 'modified',
      };

      // Parse status codes
      if (code[0] !== ' ') {
        fileObj.status = 'staged';
        fileObj.type = parseType(code[0]);
        staged.push(fileObj);
      }

      if (code[1] !== ' ') {
        fileObj.status = 'unstaged';
        fileObj.type = parseType(code[1]);
        unstaged.push(fileObj);
      }

      if (code === '??') {
        fileObj.status = 'untracked';
        fileObj.type = 'added';
        untracked.push(fileObj);
      }
    });

    return {
      success: true,
      data: {
        currentBranch: branch.trim(),
        staged,
        unstaged,
        untracked,
        isDirty: staged.length > 0 || unstaged.length > 0 || untracked.length > 0,
      },
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error };
  }
};

export const getLog = async (count: number = 15): Promise<GitResult<GitLog[]>> => {
  try {
    const { stdout } = await execa('git', [
      'log',
      `--max-count=${count}`,
      '--format=%h %s %an %cr',
    ]);

    const logs = stdout.split('\n').filter(Boolean).map(line => {
      const parts = line.split(' ');
      const hash = parts[0];
      const message = parts.slice(1, -2).join(' ');
      const author = parts[parts.length - 2];
      const date = parts.slice(-1)[0];

      return { hash, message, author, date };
    });

    return { success: true, data: logs };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error };
  }
};

export const getBranches = async (): Promise<GitResult<string[]>> => {
  try {
    const { stdout } = await execa('git', ['branch', '--format=%(refname:short)']);
    const branches = stdout.split('\n').filter(Boolean);
    return { success: true, data: branches };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error };
  }
};

export const getDiff = async (staged?: boolean): Promise<GitResult<string>> => {
  try {
    const args = ['diff', '--no-color'];
    if (staged) args.push('--cached');

    const { stdout } = await execa('git', args);
    return { success: true, output: stdout };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error };
  }
};

export const stageAll = async (): Promise<GitResult> => {
  try {
    const { stdout } = await execa('git', ['add', '.']);
    return { success: true, output: stdout };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error };
  }
};

export const commit = async (message: string): Promise<GitResult> => {
  try {
    const { stdout } = await execa('git', ['commit', '-m', message]);
    return { success: true, output: stdout };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error };
  }
};

export const push = async (branch?: string): Promise<GitResult> => {
  try {
    const args = ['push'];
    if (branch) args.push('origin', branch);

    const { stdout } = await execa('git', args);
    return { success: true, output: stdout };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error };
  }
};

export const pull = async (branch?: string): Promise<GitResult> => {
  try {
    const args = ['pull'];
    if (branch) args.push('origin', branch);

    const { stdout } = await execa('git', args);
    return { success: true, output: stdout };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error };
  }
};

export const stash = async (): Promise<GitResult> => {
  try {
    const { stdout } = await execa('git', ['stash']);
    return { success: true, output: stdout };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error };
  }
};

export const stashPop = async (): Promise<GitResult> => {
  try {
    const { stdout } = await execa('git', ['stash', 'pop']);
    return { success: true, output: stdout };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error };
  }
};

export const restore = async (): Promise<GitResult> => {
  try {
    const { stdout } = await execa('git', ['restore', '.']);
    return { success: true, output: stdout };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error };
  }
};

export const checkout = async (branch: string): Promise<GitResult> => {
  try {
    const { stdout } = await execa('git', ['checkout', branch]);
    return { success: true, output: stdout };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error };
  }
};

export const getCurrentBranch = async (): Promise<string> => {
  try {
    const { stdout } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
    return stdout.trim();
  } catch {
    return 'unknown';
  }
};

function parseType(code: string): 'added' | 'modified' | 'deleted' | 'renamed' {
  switch (code) {
    case 'A':
      return 'added';
    case 'M':
      return 'modified';
    case 'D':
      return 'deleted';
    case 'R':
      return 'renamed';
    default:
      return 'modified';
  }
}
