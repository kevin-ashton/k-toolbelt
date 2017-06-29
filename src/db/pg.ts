import { log } from './../log';
import * as PG from 'pg';

const poolsWrapped = {};

export interface PgInitDBParams {
 database: string;
 host?: string;
 user?: string;
 password?: string;
 port?: number;
 max?: number;
 idleTimeoutMillis?: number;
}

export const pg = {
    initDB: (connectionName: string, dbParams: PgInitDBParams) => {
        if(poolsWrapped[connectionName] !== undefined) {
            log.debug(`Database has already been created. Name: ${connectionName}`);
            return;
        }

        let config = { ...{ host: 'localhost', user: 'root', password: ''}, ...dbParams };
        log.info(`Init postgres database pool: ${connectionName}`);
        let pool = new PG.Pool(config);
        let poolPromisfied = dbWrapper(pool, connectionName);

        pool.on('error', (err) => {
            log.error(`Idle pg client error. Name: ${connectionName}. Message:${err.message}. Stack:${err.stack}`);
        });
        poolsWrapped[connectionName] = poolPromisfied;
    },
    getDB: (connectionName: string) => {
        if(poolsWrapped[connectionName] === undefined) {
            throw new Error(`Unable to find pg database ${connectionName}. You may need to init the database connection first`);
        }
        return poolsWrapped[connectionName];
    }
};

function dbWrapper(pool, connectionName) {
    return {
        /**
         * Usage example:
         *
         * let res = await db.query(`select * from table1 where id = $1`, [1]);
         */
        query: (query, parameters) => {
            log.debug(query);
            log.debug(parameters);
            return new Promise((resolve, reject) => {
                pool.query(query, parameters, (err, res) => {
                    if(err){
                        log.error(`
*********************
FAILED SQL QUERY:
${query}
PARAMETERS:
${parameters}
ERROR:
${JSON.stringify(err)}
*********************
`);
                        reject(err);
                    } else{
                        resolve(res);
                    }
                });
            });
        },
        disconnect: () => {
            pool.end();
            delete poolsWrapped[connectionName];
        }
    }
}
