const express = require('express');
const router = express.Router();
const { Booking, Room } = require('../models');
const verifyAdmin = require('../middlewares/verifyAdmin');

/**
 * @swagger
 * /bookings:
 *   get:
 *     description: Retorna todas as reservas
 *     responses:
 *       200:
 *         description: Lista de reservas
 */
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [{
                model: Room,
                as: 'room' // use the alias name here
            }]
        });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/**
 * @swagger
 * /bookings/{id}:
 *  get:
 *   description: Retorna uma reserva pelo id
 *  parameters:
 *  - in: path
 *   name: id
 *  required: true
 * type: integer
 * responses:
 * 200:
 * description: Uma reserva
 */
router.post('/reservas', async (req, res) => {
    try {
        const { roomId, startBooking, endBooking } = req.body;

        if (!roomId || !startBooking || !endBooking) {
            return res.status(400).json({ message: "Campos 'roomId', 'startBooking' e 'endBooking' são obrigatórios." });
        }

        const booking = await Booking.create({
            roomId: roomId,
            userId: req.userId,  // assumindo que o userId está no request após autenticação
            startBooking: startBooking,
            endBooking: endBooking,
            status: 'REQUESTED'
        });

        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /bookings/{id}:
 * get:
 * description: Retorna uma reserva pelo id
 * parameters:
 * - in: path
 * name: id
 * required: true
 * type: integer
 * responses:
 * 200:
 * description: Uma reserva
 */
router.post('/reservas/:id/aprovar', verifyAdmin, async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: "Reserva não encontrada" });
        }

        booking.status = 'APPROVED';
        await booking.save();
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /bookings/{id}:
 * get:
 * description: Retorna uma reserva pelo id
 * parameters:
 * - in: path
 * name: id
 * required: true
 * type: integer
 * responses:
 * 200:
 * description: Uma reserva
 */
router.post('/reservas/:id/rejeitar', verifyAdmin, async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: "Reserva não encontrada" });
        }

        booking.status = 'REJECTED';
        await booking.save();
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
