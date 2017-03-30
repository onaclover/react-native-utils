/*
 * @providesModule RNUtils.Logger
 */

/* eslint-disable no-console */

class Logger extends Singleton {
  constructor() {
    super();
    this.configure({ enabled: true, printLogStack: false });
  }

  configure({ enabled, printLogStack }) {
    this.enabled = enabled;
    this.printLogStack = printLogStack;
  }

  log(...args) { delegateConsole('log', ...args); }
  debug(...args) { delegateConsole('debug', ...args); }
  warn(...args) { delegateConsole('warn', ...args); }
  error(...args) { delegateConsole('error', ...args); }

  extractCalleeName(callee) {
    const components = callee.split(' ');
    return components.length > 1 ? components[0] : '';
  }

  delegateConsole(method, ...args) {
    if (!this.enabled) return;

    const callStack = new Error().stack
      .split(/\n\s+at\s+/)
      .slice(3)
      .map(extractCalleeName);
    const logPrefix = `[WeFit][${method}] ${callStack[0]}():`;
    const stackTrace = this.printLogStack ? [callStack] : [];

    console[method](logPrefix, ...args, ...stackTrace);
  }
};

export default Logger.get();

/* eslint-enable no-console */
