import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..', '..');
const envPath = path.join(projectRoot, '.env');

export const loadEnv = (): void => {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
};

export const getAPIKey = (): string | null => {
  loadEnv();
  return process.env.APIFREELLM_KEY || null;
};

export const hasAPIKey = (): boolean => {
  return getAPIKey() !== null;
};

export const saveAPIKey = (key: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    let envContent = '';

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    // Remove existing APIFREELLM_KEY line if present
    const lines = envContent.split('\n').filter(line => !line.startsWith('APIFREELLM_KEY='));

    // Add new key
    lines.push(`APIFREELLM_KEY=${key}`);

    fs.writeFile(envPath, lines.join('\n'), (err) => {
      if (err) reject(err);
      else {
        // Reload env
        process.env.APIFREELLM_KEY = key;
        resolve();
      }
    });
  });
};

export const clearAPIKey = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(envPath)) {
      resolve();
      return;
    }

    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n').filter(line => !line.startsWith('APIFREELLM_KEY='));

    fs.writeFile(envPath, lines.join('\n'), (err) => {
      if (err) reject(err);
      else {
        delete process.env.APIFREELLM_KEY;
        resolve();
      }
    });
  });
};
