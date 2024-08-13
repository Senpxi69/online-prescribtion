const express = require('express');
const router = express.Router();
const patientController = require('../controller/patientController');
const { authMiddleware } = require('../middleware/auth');

router.post('/signup', patientController.signup);

router.post('/signin', patientController.signin);

router.get('/', authMiddleware, patientController.getPatients);

router.get('/:id', authMiddleware, patientController.getPatientById);

router.put('/:id', authMiddleware, patientController.updatePatient);

router.get('/:id/consultations', authMiddleware, patientController.patientsConsultation);

module.exports = router;
