const express = require('express');
const bodyParser = require('body-parser');

const usersRoutes = require('../routes/users')
const roomsRoutes = require('../routes/rooms')
const bookingsRoutes = require('../routes/bookings')

const cors = require('cors');


const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

var swaggerDefinition = {
  info: {
    title: 'SOFT',
    version: '1.0.0',
    description: 'Sistema de Reserva de Salas'
  },
  host: 'localhost:8080',
  basePath: '/',

};

var swaggerOptions = {
  swaggerDefinition,
  apis: ['../routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);


const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/auth', usersRoutes);
app.use('/api/v1/rooms', roomsRoutes);
app.use('/api/v1/bookings', bookingsRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
  res.json({ message: "Welcome to the backend!" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
