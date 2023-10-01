const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const checkJWT = require('../middlewares/checkJWT');

const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user to the system.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User details
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - password
 *             - is_admin
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *             is_admin:
 *               type: boolean
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Internal server error
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
 * /login:
 *   post:
 *     summary: Login an existing user
 *     description: Authenticate an existing user.
 *     parameters:
 *       - in: body
 *         name: login
 *         description: User credentials
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - password
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Internal server error
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
 * /profile:
 *   get:
 *     summary: Retrieve the profile of the logged-in user
 *     description: Retrieve the profile details of the authenticated user.
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
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
