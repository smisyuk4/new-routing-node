const express = require('express');
//const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.post('/create-post', async (req, res) => {
  const { title, message } = req.body;

  res.status(200).send({ result: 'created' });

  //res.status(500).send({ error });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//let db = new sqlite3.Database(':memory:', (err) => {
//  if (err) {
//    return console.error(err.message);
//  }
//  console.log('Connected to the in-memory SQlite database.');
//});
