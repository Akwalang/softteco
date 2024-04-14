import { Logger as NestLogger } from '@nestjs/common';
import { getNamespace } from 'cls-hooked';
import * as chalk from 'chalk';

import { TRACE_ID_SESSION_NAMESPACE, TRACE_ID_KEY } from '../../constants/trace';

export class Logger extends NestLogger {
  log(message: string) {
    const session = getNamespace(TRACE_ID_SESSION_NAMESPACE);
    const traceId = session?.get(TRACE_ID_KEY);

    super.log(`${chalk.cyan(`[traceId=${traceId}]`)} ${chalk.green(message)}`);
  }
}
