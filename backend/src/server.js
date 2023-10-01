const express = require('express');
const bodyParser = require('body-parser');

const usersRoutes = require('../routes/users')
const roomsRoutes = require('../routes/rooms')
const bookingsRoutes = require('../routes/bookings')

const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/auth', usersRoutes);
app.use('/api/v1/rooms', roomsRoutes);
app.use('/api/v1/bookings', bookingsRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Welcome to the backend!" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
