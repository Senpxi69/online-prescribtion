const express = require('express');
const router = express.Router();
const {
    createPrescription,
    getPrescriptionsByPatientId,
    updatePrescription,
    getPrescriptionsByDoctorsId
} = require('../controller/prescribtionController');
const { authMiddleware } = require('../middleware/auth');

router.post('/create', authMiddleware, createPrescription);

router.get('/:id', authMiddleware, getPrescriptionsByPatientId);

router.get('/doctor/:id', authMiddleware, getPrescriptionsByDoctorsId);

router.put('/prescription-update/:id', authMiddleware, updatePrescription);

module.exports = router;
