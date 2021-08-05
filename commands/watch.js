/* eslint-disable require-atomic-updates */
import path from 'node:path';
import chokidar from 'chokidar';
import ora from 'ora';
import {debounce} from 'lodash-es';
import notifier from 'node-notifier';
import pRetry from 'p-retry';
import write from '../lib/write.js';
import del from '../lib/delete.js';
import mkdirp from '../lib/mkdirp.js';
import log from '../lib/log.js';

/**
 * @param {import('../index.js').DWArgv} argv
 */
export default (argv) => {
  const {cartridges, codeVersion, webdav, request, silent} = argv;

  try {
    log.info(`Pushing ${codeVersion} changes to ${webdav}`);

    const debouncedNotify = debounce(
      (arguments_) => notifier.notify(arguments_),
      150
    );
    const uploading = new Set();
    const removing = new Set();
    let spinner;
    let text;

    const watcher = chokidar.watch('dir', {
      ignored: [/[/\\]\./, '**/node_modules/**'],
      ignoreInitial: true,
      persistent: true,
      atomic: true,
    });

    if (argv.spinner) {
      text = `Watching '${cartridges}' for ${webdav} [Ctrl-C to Cancel]`;
      spinner = ora(text).start();
    }

    watcher.add(path.join(process.cwd(), cartridges));

    const upload = async (file) => {
      const source = path.relative(process.cwd(), file); // Keep the same as in remove
      const directory = path
        .dirname(source)
        .replace(path.normalize(cartridges), '');
      const destination = path.join('Cartridges', codeVersion, directory);

      if (!uploading.has(source)) {
        uploading.add(source);
        if (!silent) {
          debouncedNotify({
            title: 'File Changed',
            message: source,
          });
        }
        if (spinner) {
          spinner.stopAndPersist({text: `${source} changed`});
          spinner.text = text;
          spinner.start();
        }

        try {
          await pRetry(() => mkdirp(destination, request), {retries: 5});
          await pRetry(() => write(source, destination, request), {retries: 5});
          if (!silent) {
            debouncedNotify({
              title: 'File Uploaded',
              message: `${path.basename(source)} => ${destination}`,
            });
          }
          if (spinner) {
            spinner.text = `${path.basename(source)} pushed to ${destination}`;
            spinner.succeed();
          }
        } catch (error) {
          console.log(error);
          if (spinner) {
            spinner.text = error.message;
            spinner.fail();
          }
        }

        if (spinner) {
          spinner.text = text;
          spinner.start();
        }
        uploading.delete(source);
      }
    };

    const remove = async (file) => {
      const source = path.relative(process.cwd(), file); // Keep the same as in upload
      const directory = path
        .dirname(source)
        .replace(path.normalize(cartridges), '');
      const destination = path.join('Cartridges', codeVersion, directory);
      const url = path.join(destination, path.basename(source));

      if (!removing.has(source) && !uploading.has(source)) {
        removing.add(source);
        if (!silent) {
          debouncedNotify({
            title: 'Local file removed',
            message: source,
          });
        }
        if (spinner) {
          spinner.stopAndPersist({text: `${source} removed locally`});
          spinner.text = text;
          spinner.start();
        }

        try {
          await del(url, request);
          // const tryToRemove = () => del(url, request);
          // await pRetry(tryToRemove, {retries: 5});
          if (!silent) {
            debouncedNotify({
              title: 'Remote file removed',
              message: url,
            });
          }
          if (spinner) {
            spinner.text = `${path.basename(
              source
            )} removed from ${destination}`;
            spinner.succeed();
          }
        } catch (error) {
          if (spinner) {
            spinner.text = `Couldn't remove ${url}: ${error.message}`;
            spinner.fail();
          }
        }

        if (spinner) {
          spinner.text = text;
          spinner.start();
        }
        removing.delete(source);
      }
    };

    watcher.on('change', upload);
    watcher.on('add', upload);
    if (argv.remove) watcher.on('unlink', remove);
  } catch (error) {
    log.error(error);
  }
};
