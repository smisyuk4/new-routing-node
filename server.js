const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const { postRouter } = require('./routes/postRoutes');
const { commentRouter } = require('./routes/commentRoutes');
const { userRouter } = require('./routes/userRoutes');
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

app.use(bodyParser.json());
app.use('/api-v1/', express.static('public'));
app.use('/api-v1/doc', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use('/api-v1', postRouter);
app.use('/api-v1/post', commentRouter);
app.use('/api-v1/user', userRouter);
app.use('/api-v1', bookRouter);

app.listen(PORT, () => {
  console.log(`My server started on port ${PORT}`);
});
