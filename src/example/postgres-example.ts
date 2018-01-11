import { pg } from '../main';
import { LogLevel, log } from '../log';
log.setLevel(LogLevel.Debug);

async function main() {
  try {
    await pg.initDB('database1', {
      database: 'example1',
      host: 'localhost',
      user: 'postgres',
      password: 'password1',
    });

    let db1 = pg.getDB('database1');

    let res = await db1.query('select * from foo');
    console.log(res);

    db1.disconnect();
  } catch (e) {
    console.log('There was an error!');
    console.log(e);
  }
}

main();
