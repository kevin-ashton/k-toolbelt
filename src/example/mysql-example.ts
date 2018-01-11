import { mysql } from '../main';
import { LogLevel, log } from '../log';
log.setLevel(LogLevel.Debug);

async function main() {
  try {
    await mysql.initDB('database1', {
      database: 'example1',
      host: 'localhost',
      user: 'root',
      password: 'password1',
    });

    console.log('We came back');

    let db1 = mysql.getDB('database1');

    let res = await db1.query('select * from foo');
    console.log(res);
    db1.disconnect();
  } catch (e) {
    console.log('Error');
    console.log(e);
  }
}

main();
