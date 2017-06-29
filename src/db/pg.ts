import { log } from './../log';
import * as PG from 'pg';
const Pool = PG.Pool;

const pools = {};
const poolsPromisfied = {};

export interface PgInitDBParams {
 name: string;
 database: string;
 host?: string;
 user?: string;
 password?: string;
 port?: number;
 max?: number;
 idleTimeoutMillis?: number;

}

export const pg = {
    initDB: (initParams: PgInitDBParams) => {
        if(pools[initParams.name] !== undefined) {
            log.error(`Database has already been created. Name: ${initParams.name}`);
        }

        let config = { ...{ host: 'localhost', user: 'root', password: ''}, ...initParams };
        log.info(`Init postgres database pool: ${initParams.name}`);
        let pool = new Pool(config);

        let poolPromisfied = dbWrapper(pool);
        pool.on('error', (err) => {
            log.error(`Idle pg client error. Name: ${initParams.name}. Message:${err.message}. Stack:${err.stack}`);
        });
        pools[initParams.name] = pool;
        poolsPromisfied[initParams.name] = poolPromisfied;
    },
    endDB: (name: string) => {
        if(pools[name] === undefined) {
            throw new Error(`Unable to find pg database ${name}. You may need to init the database connection first`);
        }
        pools[name].end();
    },
    getDB: (name: string) => {
        if(pools[name] === undefined) {
            throw new Error(`Unable to find pg database ${name}. You may need to init the database connection first`);
        }
        return pools[name];
    }
};

function dbWrapper(pool) {
    return {
        /**
         * let res = await db.query(`select * from table1 where id = $1`, [1]);
         */
        query: (query, parameters) => {
            log.debug(query);
            log.debug(parameters);
            return new Promise((resolve, reject) => {
                pool.query(query, parameters, (err, res) => {
                    if(err){
                        log.error(`*********************`);
                        log.error(`FAILED SQL QUERY:`);
                        log.error(query);
                        log.error(`PARAMETERS`);
                        log.error(parameters);
                        log.error(`ERROR`);
                        log.error(err);
                        log.error(`ERROR - stringify: ${JSON.stringify(err)}`);
                        log.error(`*********************`);
                        reject(err);
                    } else{
                        resolve(res);
                    }
                });
            });
        }
    }
}
