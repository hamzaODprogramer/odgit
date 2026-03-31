export type AppSection = 'FILES' | 'ACTIONS' | 'SETTINGS';
export type AppMode = 'normal' | 'confirm' | 'input' | 'help' | 'generate';

export interface GitFile {
  path: string;
  status: 'staged' | 'unstaged' | 'untracked';
  type: 'added' | 'modified' | 'deleted' | 'renamed';
}

export interface GitStatus {
  currentBranch: string;
  staged: GitFile[];
  unstaged: GitFile[];
  untracked: GitFile[];
  isDirty: boolean;
}

export interface GitLog {
  hash: string;
  message: string;
  author: string;
  date: string;
}
