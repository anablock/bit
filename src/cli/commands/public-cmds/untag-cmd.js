/** @flow */
import chalk from 'chalk';
import Command from '../../command';
import { unTagAction } from '../../../api/consumer';
import type { untagResult } from '../../../scope/component-ops/untag-component';
import GeneralError from '../../../error/general-error';
import { BASE_DOCS_DOMAIN, WILDCARD_HELP } from '../../../constants';

export default class Untag extends Command {
  name = 'untag [id] [version]';
  description = `revert version(s) tagged for component(s)
  https://${BASE_DOCS_DOMAIN}/docs/cli-untag.html
  ${WILDCARD_HELP('untag')}`;
  alias = '';
  opts = [
    ['a', 'all', 'revert tag for all tagged components'],
    [
      'f',
      'force',
      'revert the tag even if used as a dependency. WARNING: components that depend on this tag will corrupt'
    ]
  ];
  loader = true;
  migration = true;

  action([id, version]: string[], { all, force }: { all: ?boolean, force: ?boolean }): Promise<untagResult[]> {
    if (!id && !all) {
      throw new GeneralError('please specify a component ID or use --all flag');
    }

    if (all) {
      version = id;
      return unTagAction(version, force);
    }
    return unTagAction(version, force, id);
  }

  report(results: untagResult[]): string {
    const title = chalk.green(`${results.length} component(s) were untagged:\n`);
    const components = results.map((result) => {
      return `${chalk.cyan(result.id.toStringWithoutVersion())}. version(s): ${result.versions.join(', ')}`;
    });
    return title + components.join('\n');
  }
}
