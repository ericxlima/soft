const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const checkJWT = require('../middlewares/checkJWT');

const router = express.Router();

/**
 * @swagger
 * /users:
 * get:
 * description: Cadastro de um usuário
 * responses:
 * 200:
 * description: Um usuário
 */
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            username: req.body.username,
            password: hashedPassword,
            is_adm: req.body.is_admin
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * @swagger
 * /users:
 * get:
 * description: Login
 * responses:
 * 200:
 * description: Um usuário
 */
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

/**
 * @swagger
 * /users/profile:
 * get:
 * description: Retorna o perfil do usuário logado
 * responses:
 * 200:
 * description: Um usuário
 */
router.get('/profile', checkJWT, async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.user.sub } });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.send({
            id: user.id,
            username: user.username,
            is_adm: user.is_adm
        });

    } catch (error) {
        res.status(500).send({ message: 'Server error' });
    }
});


module.exports = router;
