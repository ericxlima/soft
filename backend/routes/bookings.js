const express = require('express');
const router = express.Router();
const { Booking, Room } = require('../models');
const verifyAdmin = require('../middlewares/verifyAdmin');

// Lista todas as solicitações de reserva
router.get('/reservas', async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [Room]
        });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Solicita a reserva de uma sala
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

// Aprova uma solicitação de reserva (apenas para administradores)
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

// Rejeita uma solicitação de reserva (apenas para administradores)
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
