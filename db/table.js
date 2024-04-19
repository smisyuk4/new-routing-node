const sqlite3 = require('sqlite3').verbose();

// connect to db
let db = new sqlite3.Database('./posts.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

// create table
const sql = `CREATE TABLE posts(id INTEGER PRIMARY KEY,title,message)`;
db.run(sql);
