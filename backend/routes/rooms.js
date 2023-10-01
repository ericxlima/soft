const express = require('express');
const router = express.Router();
const { Room } = require('../models');
const verifyAdmin = require('../middlewares/verifyAdmin');
const checkJWT = require('../middlewares/checkJWT');

/**
 * @swagger
 * /rooms/:
 *   get:
 *     summary: Retrieve a list of all rooms
 *     description: Returns a list of rooms available in the system.
 *     responses:
 *       200:
 *         description: List of rooms
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               status:
 *                 type: string
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /rooms/:
 *   post:
 *     summary: Create a new room
 *     description: Add a new room to the system.
 *     parameters:
 *       - in: body
 *         name: room
 *         description: Room details
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - capacity
 *           properties:
 *             name:
 *               type: string
 *             capacity:
 *               type: integer
 *     responses:
 *       201:
 *         description: Room created successfully
 *       400:
 *         description: Bad request (missing required fields)
 *       500:
 *         description: Error creating room
 */
router.post('/', async (req, res) => {
  // router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name, capacity } = req.body;

    if (!name || !capacity) {
      return res.status(400).json({ message: "Campos 'name' e 'capacity' são obrigatórios." });
    }

    const newRoom = {
      name: name,
      capacity: capacity,
      status: 'AVAILABLE'
    };

    const room = await Room.create(newRoom);

    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar sala.", error: err.message });
  }
});

module.exports = router;