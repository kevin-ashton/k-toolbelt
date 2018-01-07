import { log } from './../log';
import * as colors from 'colors/safe';
import * as mysqlLib from 'mysql';

const poolsWrapped = {};

export interface MysqlInitDBParams {
  database: string;
  host?: string;
  user?: string;
  password?: string;
}

export const mysql = {
  initDB: (connectionName: string, dbParams: MysqlInitDBParams) => {
    if (poolsWrapped[connectionName] !== undefined) {
      log.debug(`Database has already been created. Name: ${connectionName}`);
      return;
    }

    let defaults = {
      host: 'localhost',
      user: 'root',
      password: '',
      connectionLimit: 10,
    };

    let config = { ...defaults, ...dbParams };
    log.info(`Init mysql database connection: ${connectionName}`);
    let pool = mysqlLib.createPool(config);
    let poolPromisfied = dbWrapper(pool, connectionName);

    poolsWrapped[connectionName] = poolPromisfied;
  },
  getDB: (connectionName: string) => {
    if (poolsWrapped[connectionName] === undefined) {
      throw new Error(
        `Unable to find mysql database ${connectionName}. You may need to init the database connection first`,
      );
    }
    return poolsWrapped[connectionName];
  },
};

function dbWrapper(pool, connectionName) {
  return {
    /**
     * Usage example:
     *
     * let res = await db.query(`select * from table1 where id = ?`, [1]);
     */
    query: (query, parameters = []) => {
      log.debug(query);
      log.debug(parameters);
      return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
          if (err) {
            log.error('Trouble obtaining mysql connection from pool');
            log.error(`${err}`);
            reject(err);
          }

          connection.query(query, parameters, (error, results) => {
            connection.release();

            resolve(results);

            if (err) {
              log.error(`
*********************
FAILED SQL QUERY:
${query}
PARAMETERS:
${parameters}
ERROR:
${JSON.stringify(error)}
*********************
`);
              reject(error);
            }
          });
        });
      });
    },
    disconnect: () => {
      pool.end();
      delete poolsWrapped[connectionName];
    },
  };
}
