import { mysql } from '../main';

async function main() {
  mysql.initDB('database1', {
    database: 'example1',
    host: 'localhost',
    user: 'root',
    password: 'password1',
  });

  let db1 = mysql.getDB('database1');

  let res = await db1.query('select * from foo');
  console.log(res);
}

main();
