import figlet from 'figlet';
import { colors } from './colors.js';

export const renderTitle = (): string => {
  try {
    const ascii = figlet.textSync('ODGIT', {
      font: 'Standard',
    });
    return colors.title(ascii);
  } catch (e) {
    return colors.title('  ╔═════════════════╗\n  ║     ODGIT      ║\n  ╚═════════════════╝');
  }
};

export const renderSubtitle = (): string => {
  return colors.cyan('  git dashboard · type ? for help');
};
