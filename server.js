const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const { postRouter } = require('./routes/postRoutes');
const { authorRouter } = require('./routes/authorRoutes');
const { bookRouter } = require('./routes/bookRoutes');

const openapiSpecification = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
});

const PORT = process.env.PORT || 8080;
const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use(bodyParser.json());
app.use(postRouter);
app.use(authorRouter);
app.use(bookRouter);

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
