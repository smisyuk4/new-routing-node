const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('dotenv').config();

const { postRouter } = require('./routes/postRoutes');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(postRouter);

app.get('/', async (req, res) => {
  return res.json({
    status: 200,
    success: true,
    text: 'hello world',
  });
});

app.listen(PORT, () => {
  console.log(`My server started on port ${PORT}`);
});
