## data base

- [sqlite - nodejs](https://www.sqlitetutorial.net/sqlite-nodejs/connect/)
- [datatype3](https://www.sqlite.org/datatype3.html)
- [video-1](https://www.youtube.com/watch?v=ZRYn6tgnEgM&ab_channel=ByteMyke)
- [Build a Node JS SQLite API tutorial - video](https://www.youtube.com/watch?v=mnH_1YGR2PM&ab_channel=ByteMyke)
- [sqlite-trigger](https://www.sqlitetutorial.net/sqlite-trigger/)
- [statements-control-flow](https://www.sqlitetutorial.net/sqlite-nodejs/statements-control-flow/)
- [sqlite-limit](https://www.sqlitetutorial.net/sqlite-limit/)

## Auth

- [jsonwebtoken npm](https://www.npmjs.com/package/jsonwebtoken)
- [JWT Authentication Tutorial - Node.js - video](https://www.youtube.com/watch?v=mbsmsi7l3r4&t=828&ab_channel=WebDevSimplified)

## Status code

- [200](https://www.akto.io/academy/200-status-code)
- [204](https://www.akto.io/academy/204-status-code)

## other

- [body-parser](https://www.npmjs.com/package/body-parser)
- [swagger](https://www.npmjs.com/package/swagger-ui-express)
- [swagger - specification](https://swagger.io/docs/specification/components/)
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc?tab=readme-ov-file)
- [Swagger API documentation tutorial - video](https://www.youtube.com/watch?v=dhMlXoTD3mQ&ab_channel=SkillsWithArif)
- [example repository](https://github.com/developerarif55/sequlize-ORM/blob/dev/routes/book.js)
- [NodeJS Swagger API Documentation Tutorial Using Swagger JSDoc](https://www.youtube.com/watch?v=S8kmHtQeflo&ab_channel=MaksimIvanov)

## Пагінація

SELECT \* FROM table_name LIMIT offset, limit;
table_name - назва таблиці, з якої ви вибираєте дані.
offset - кількість рядків, які потрібно пропустити. Це вказує на номер першого рядка, який повинен бути повернений у вибірці.
limit - максимальна кількість рядків, які потрібно повернути.

Ось приклад використання пагінації в SQLite:

const pageNumber = 1; // Номер сторінки
const pageSize = 10; // Розмір сторінки

const offset = (pageNumber - 1) \* pageSize; // Обчислення зміщення для поточної сторінки

const sql = `SELECT * FROM your_table_name LIMIT ?, ?`;

db.all(sql, [offset, pageSize], (err, rows) => {
if (err) {
return console.error('Помилка запиту на пагінацію:', err);
}

console.log('Рядки:', rows);
});

У цьому прикладі pageNumber вказує на номер сторінки, а pageSize вказує на кількість рядків, які потрібно повернути на кожній сторінці. Вираховуючи offset, ви визначаєте, з якого рядка починати вибірку для поточної сторінки.
