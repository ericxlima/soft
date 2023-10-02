const express = require('express');
const bodyParser = require('body-parser');

const usersRoutes = require('./routes/users')
const roomsRoutes = require('./routes/rooms')
const bookingsRoutes = require('./routes/bookings')

const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

// Swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

var swaggerDefinition = {
  info: {
    title: 'SOFT',
    version: '1.0.0',
    description: 'Sistema de Reserva de Salas'
  },
  components: {
    schemas: require('./models/schemas')
  },
  host: 'localhost:8080',
  basePath: '/',
};

var swaggerOptions = {
  swaggerDefinition: swaggerDefinition,
  apis: ['./routes/*.js'],
};

// 

const swaggerDocs = swaggerJsDoc(swaggerOptions);


const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

app.use(cors());
// app.use(cors({
//   origin: '*',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/auth', usersRoutes);
app.use('/api/v1/rooms', roomsRoutes);
app.use('/api/v1/bookings', bookingsRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
  res.json({ message: "Welcome to the backend!" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
