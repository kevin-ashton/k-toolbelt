import { pg } from '../main';

async function main() {
  pg.initDB('database1', {
    database: 'example1',
    host: 'localhost',
    user: 'postgres',
    password: 'password1',
  });

  let db1 = pg.getDB('database1');

  let res = await db1.query('select * from foo');
  console.log(res);
}

main();
