const express = require('express');
const bodyParser = require('body-parser');

const usersRoutes = require('../routes/users')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/auth', usersRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Welcome to the backend!" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
