import * as colors from 'colors/safe'

export enum LogLevel {
    Debug = 1,
    Info,
    Error
}

let level = LogLevel.Info;

export const log = {
    setLevel: (newLevel: LogLevel) => {
        level = newLevel;
    },
    debug: msg => {
        if(level <= LogLevel.Debug) {
            console.log(colors.gray(msg));
        }
    },
    info: msg => {
        if(level <= LogLevel.Info) {
            console.log(colors.green(msg));
        }
    },
    error: msg => {
        if(level <= LogLevel.Error) {
            console.error(colors.red(`ERROR: ${msg}`));
        }
    },
};
