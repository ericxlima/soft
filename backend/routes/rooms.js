const express = require('express');
const router = express.Router();
const { Room } = require('../models');
const verifyAdmin = require('../middlewares/verifyAdmin');
const checkJWT = require('../middlewares/checkJWT');

router.get('/', async (req, res) => {
    try {
        const rooms = await Room.findAll();
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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