import * as colors from 'colors/safe';

export enum LogLevel {
  Debug = 1,
  Info,
  Warn,
  Error,
}

let defaultLevel = LogLevel.Warn;
let level = defaultLevel;

export const log = {
  getLevel: () => {
    return level;
  },
  setLevel: (newLevel: LogLevel) => {
    level = newLevel;
  },
  debug: (msg) => {
    if (level <= LogLevel.Debug) {
      console.log(colors.gray(msg));
    }
  },
  info: (msg) => {
    if (level <= LogLevel.Info) {
      console.log(colors.green(msg));
    }
  },
  warn: (msg) => {
    if (level <= LogLevel.Warn) {
      console.log(colors.yellow(msg));
    }
  },
  error: (msg) => {
    if (level <= LogLevel.Error) {
      console.error(colors.red(`ERROR: ${msg}`));
    }
  },
};
