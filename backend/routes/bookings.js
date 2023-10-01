const express = require('express');
const router = express.Router();
const { Booking, Room } = require('../models');
const verifyAdmin = require('../middlewares/verifyAdmin');

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve a list of all bookings
 *     description: Returns a list of all bookings with their associated room.
 *     responses:
 *       200:
 *         description: List of bookings
 *       500:
 *         description: Internal server error
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
 * /:
 *   post:
 *     summary: Create a new booking
 *     description: Add a new booking to the system.
 *     parameters:
 *       - in: body
 *         name: booking
 *         description: Booking details
 *         schema:
 *           type: object
 *           required:
 *             - roomId
 *             - startBooking
 *             - endBooking
 *             - userId
 *           properties:
 *             roomId:
 *               type: integer
 *             startBooking:
 *               type: string
 *               format: date-time
 *             endBooking:
 *               type: string
 *               format: date-time
 *             userId:
 *               type: integer
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Bad request (missing required fields)
 *       500:
 *         description: Error creating booking
 */
router.post('/', async (req, res) => {
  try {
    const { roomId, userId, startBooking, endBooking } = req.body;

    if (!roomId || !startBooking || !endBooking || !userId) {
      return res.status(400).json({ message: "Campos 'roomId', 'startBooking', 'endBooking' e 'userId' são obrigatórios." });
    }
    const booking = await Booking.create({
      roomId: roomId,
      userId: userId,
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
 * /user/{id}:
 *   get:
 *     summary: Retrieve all bookings for a specific user
 *     description: Returns a list of all bookings made by the specified user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: List of bookings for the user
 *       500:
 *         description: Internal server error
 */
router.get('/user/:id', async (req, res) => {
  // Seleciona todas as reservas pelo usuário
  try {
    const bookings = await Booking.findAll({
      where: {
        userId: req.params.id
      }
    });
    res.json(bookings);
  } catch (err) {
    console.log(err, req.params.id)
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /reservas/{id}/aprovar:
 *   post:
 *     summary: Approve a booking
 *     description: Approve a specified booking by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Booking approved successfully
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
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
 * /reservas/{id}/rejeitar:
 *   post:
 *     summary: Reject a booking
 *     description: Reject a specified booking by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Booking rejected successfully
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
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
