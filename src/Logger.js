/*
 * @providesModule RNUtils.Logger
 */

/* eslint-disable no-console */

import Singleton from 'singleton';

class Logger extends Singleton {
  constructor() {
    super();
    this.configure({ enabled: true, printLogStack: false });
  }

  configure = ({ enabled, printLogStack }) => {
    if (enabled !== undefined) this.enabled = enabled;
    if (printLogStack !== undefined) this.printLogStack = printLogStack;
  };

  log = (...args) => this.delegateConsole('log', ...args);
  debug = (...args) => this.delegateConsole('debug', ...args);
  warn = (...args) => this.delegateConsole('warn', ...args);
  error = (...args) => this.delegateConsole('error', ...args);

  delegateConsole = (method, ...args) => {
    if (!this.enabled) return;

    const callStack = new Error().stack
      .split(/\n\s+at\s+/)
      .slice(3)
      .map(this.extractCalleeName);
    const logPrefix = `[WeFit][${method}] ${callStack[0]}():`;
    const stackTrace = this.printLogStack ? [callStack] : [];

    console[method](logPrefix, ...args, ...stackTrace);
  };

  extractCalleeName = callee => {
    const components = callee.split(' ');
    return components.length > 1 ? components[0] : '';
  };
}

export default Logger.get();

/* eslint-enable no-console */
