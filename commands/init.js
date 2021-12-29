import path from 'node:path';
import fs from 'fs-extra';
import { fileURLToPath } from 'node:url';
import log from '../lib/log.js';

// @ts-ignore
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async () => {
  try {
    await fs.stat(path.join(process.cwd(), 'dw-cli.json'));
    log.error(`'dw-cli.json' already exists`);
  } catch {
    const template = await fs.readFile(
      path.join(__dirname, '../dw-cli.json.example'),
      'utf8'
    );
    await fs.writeFile('dw-cli.json', template.trim(), 'utf8');
    log.success(`'dw-cli.json' created`);
  }
};
