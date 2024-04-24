const sqlite3 = require('sqlite3').verbose();

// connect to db
const db = new sqlite3.Database(
  './posts-new.db',
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  }
);

// create table
const sql = `CREATE TABLE users(
  user_id INTEGER PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT,
  sign_plan TEXT,
  payment TEXT,
  location TEXT,
  avatar_url TEXT,
  token TEXT,
  date_register TEXT,
  date_update TEXT)`;
//const sql = `CREATE TABLE posts(post_id INTEGER PRIMARY KEY,author_id INTEGER,title TEXT,message TEXT,date_publish TEXT,date_update TEXT)`;

//const sql = `CREATE TABLE books(
//  book_id INTEGER PRIMARY KEY,
//  author_id INTEGER,
//  title TEXT,
//  short_desc TEXT,
//  cover_image_url TEXT,
//  literary_genre TEXT,
//  cost INTEGER,
//  count INTEGER,
//  date_publish TEXT,
//  date_update TEXT)`;

//const sql = `ALTER TABLE authors ADD COLUMN token`;
//const sql = 'DROP TABLE authors;'

db.run(sql);
console.log(`process for ${sql} - done`);

// Щоб додати нову властивість до існуючої таблиці SQLite, вам потрібно виконати SQL запит ALTER TABLE,
// який додасть новий стовпчик. Ось як це можна зробити:
// ALTER TABLE your_table_name
// ADD COLUMN author TEXT;
