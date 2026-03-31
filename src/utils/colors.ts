import chalk from 'chalk';
import gradient from 'gradient-string';

export const COLORS = {
  bgDark: '#0a0a0f',
  bgSidebar: '#0d0d14',
  cyan: '#00d4ff',
  magenta: '#ff00ff',
  mutedPurple: '#666688',
  green: '#00ff41',
  red: '#ff1744',
  yellow: '#ffd700',
  white: '#ffffff',
  gray: '#9e9e9e',
};

export const clearScreen = (): void => {
  process.stdout.write('\x1b[48;2;10;10;15m\x1b[2J\x1b[H');
};

export const drawBox = (
  width: number,
  height: number,
  title: string = '',
  color: string = '#00d4ff'
): string[] => {
  const lines: string[] = [];
  const titlePadded = title ? ` ${title} ` : '';
  const titleSpaces = Math.max(0, width - titlePadded.length - 4);

  // Top border
  lines.push(
    chalk.hex(color)('╔') +
      chalk.hex(color)('═'.repeat(Math.max(0, width - 2))) +
      chalk.hex(color)('╗')
  );

  // Title line if title exists
  if (title) {
    lines[0] =
      chalk.hex(color)('╔') +
      chalk.hex(color)(titlePadded) +
      chalk.hex(color)('═'.repeat(titleSpaces)) +
      chalk.hex(color)('╗');
  }

  // Middle lines
  for (let i = 1; i < height - 1; i++) {
    lines.push(chalk.hex(color)('║') + ' '.repeat(Math.max(0, width - 2)) + chalk.hex(color)('║'));
  }

  // Bottom border
  lines.push(
    chalk.hex(color)('╚') +
      chalk.hex(color)('═'.repeat(Math.max(0, width - 2))) +
      chalk.hex(color)('╝')
  );

  return lines;
};

export const pad = (text: string, width: number, align: 'left' | 'center' | 'right' = 'left'): string => {
  if (text.length >= width) return text.substring(0, width);
  const padding = width - text.length;
  switch (align) {
    case 'center':
      const left = Math.floor(padding / 2);
      return ' '.repeat(left) + text + ' '.repeat(padding - left);
    case 'right':
      return ' '.repeat(padding) + text;
    default:
      return text + ' '.repeat(padding);
  }
};

export const colors = {
  title: (text: string) => gradient(['#00d4ff', '#ff00ff'])(text),
  cyan: (text: string) => chalk.hex('#00d4ff')(text),
  magenta: (text: string) => chalk.hex('#ff00ff')(text),
  green: (text: string) => chalk.hex('#00ff41')(text),
  red: (text: string) => chalk.hex('#ff1744')(text),
  gray: (text: string) => chalk.hex('#9e9e9e')(text),
  muted: (text: string) => chalk.hex('#666688')(text),
  white: (text: string) => chalk.hex('#e0e0ff')(text),
};

export const border = {
  top: (width: number) => colors.cyan('╔' + '═'.repeat(Math.max(0, width - 2)) + '╗'),
  bottom: (width: number) => colors.cyan('╚' + '═'.repeat(Math.max(0, width - 2)) + '╝'),
  mid: (width: number) => colors.cyan('├' + '─'.repeat(Math.max(0, width - 2)) + '┤'),
  left: () => colors.cyan('║'),
  right: () => colors.cyan('║'),
};

export const centerText = (text: string, width: number): string => {
  const padding = Math.max(0, width - text.length);
  const left = Math.floor(padding / 2);
  const right = padding - left;
  return ' '.repeat(left) + text + ' '.repeat(right);
};
