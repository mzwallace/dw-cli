import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// @ts-ignore
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default () => {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      stdio: ['pipe', 'pipe', 'ignore'],
      encoding: 'utf8',
    })
      .split('\n')
      .join('');
  } catch {
    return path.dirname(__dirname);
  }
};
