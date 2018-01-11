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
    return new Promise(async (resolve, reject) => {
      if (poolsWrapped[connectionName] !== undefined) {
        log.debug(`Database has already been created. Name: ${connectionName}`);
        resolve();
      }

      let defaults = {
        host: 'localhost',
        user: 'postgres',
        password: '',
      };

      let config = { ...defaults, ...dbParams };
      log.info(`Init postgres database pool: ${connectionName}`);
      let pool = new PG.Pool(config);
      let poolPromisfied = dbWrapper(pool, connectionName);

      pool.on('error', (err) => {
        log.error(`Idle pg client error. Name: ${connectionName}. Message:${err.message}. Stack:${err.stack}`);
        reject(err);
      });
      poolsWrapped[connectionName] = poolPromisfied;

      try {
        log.info('Testing connection');
        let res = await poolsWrapped[connectionName].query(`select 'hello world' as hello_world`, []);
        log.debug(res);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  getDB: (connectionName: string): PgWrappedDb => {
    if (poolsWrapped[connectionName] === undefined) {
      throw new Error(
        `Unable to find pg database ${connectionName}. You may need to init the database connection first`,
      );
    }
    return poolsWrapped[connectionName];
  },
};

export interface PgWrappedDb {
  query: (query: string, parameters?: any[]) => Promise<any[]>;
  disconnect: () => void;
}

function dbWrapper(pool, connectionName): PgWrappedDb {
  return {
    /**
     * Usage example:
     *
     * let res = await db.query(`select * from table1 where id = $1`, [1]);
     */
    query: (query, parameters = []): Promise<any[]> => {
      log.debug(query);
      log.debug(parameters);
      return new Promise((resolve, reject) => {
        pool.query(query, parameters, (err, res) => {
          if (err) {
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
          } else {
            resolve(res.rows);
          }
        });
      });
    },
    disconnect: () => {
      pool.end();
      delete poolsWrapped[connectionName];
    },
  };
}
