const express = require('express');
const router = express.Router();
const doctorController = require('../controller/doctorController');
const { authMiddleware } = require('../middleware/auth');

router.post('/signup', doctorController.signup);

router.post('/signin', doctorController.signin);

router.get('/profiles', authMiddleware, doctorController.getProfile);

router.get('/:id', authMiddleware, doctorController.getDoctorById);

router.get('/consultations/:id', authMiddleware, doctorController.viewConsultation);

router.post('/prescriptions', authMiddleware, doctorController.createPrescription);

module.exports = router;
