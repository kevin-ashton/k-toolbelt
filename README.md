# k-toolbelt
Combination of various node tools used for quick prototyping


# Install
`npm install --save k-toolbelt`

# Data Sources

## Postgres
```
import { pg } from 'k-node-tools';

pg.initDB({
    name: 'name1',
    host: '',
    database: '',
    user: '',
    password: ''
});

let db = pg.getDB('name1');
let res = await pg.query(`select * from foo where id = $1`, [5]);
res.rows.forEach(r => console.log(r.id);)

pg.endDB('name1';

```

# Logging
```
import { log } from 'k-node-tools';
log.setLevel('debug');

log.info('cool');
log.error('bad');


```

