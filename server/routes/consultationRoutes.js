const express = require('express');
const router = express.Router();
const consultationController = require('../controller/consultationController');
const { authMiddleware } = require('../middleware/auth');

router.post('/create', authMiddleware, consultationController.createConsultation);

router.put('/update', authMiddleware, consultationController.updateConsultations);

router.get('/:id', authMiddleware, consultationController.findConsultationById)

module.exports = router;
