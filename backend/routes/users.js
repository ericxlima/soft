const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            username: req.body.username,
            password: hashedPassword
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({ sub: user.id }, 'SOFT_SECRET_KEY', { expiresIn: '6h' });
            res.status(200).json({ token });
        } else {
            res.status(401).send('Authentication failed');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
