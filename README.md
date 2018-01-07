# k-toolbelt
Combination of various node tools used for quick prototyping

# Install
`npm install --save k-toolbelt`

# Data Sources

## Postgres
```typescript
import { pg } from 'k-toolbelt';

pg.initDB('name1', {
    host: '',
    database: '',
    user: '',
    password: ''
});

let db = pg.getDB('name1');
let res = await db.query(`select * from foo where id = $1`, [5]);
res.forEach(r => console.log(r.id);)
db.disconnect();

```

## MySQL
```typescript
import { mysql } from 'k-toolbelt';

mysql.initDB('name1', {
    host: '',
    database: '',
    user: '',
    password: ''
});

let db = mysql.getDB('name1');
let res = await db.query(`select * from foo where id = ?`, [5]);
res.forEach(r => console.log(r.id);)
db.disconnect();

```

# Logging
```typescript
import { log } from 'k-node-tools';
log.setLevel('debug');

log.info('foo');
log.error('bar');


```

