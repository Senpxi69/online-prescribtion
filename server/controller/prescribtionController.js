const mongoose = require('mongoose');
const Prescription = require('../models/prescribtionModel');
const Consultation = require('../models/consultationModel');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');

exports.createPrescription = async (req, res) => {
    try {
        const { consultation, careToBeTaken, medicines, doctor, patient } = req.body;

        if (!consultation || !careToBeTaken || !medicines || !doctor || !patient) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        if (!mongoose.Types.ObjectId.isValid(consultation) || !mongoose.Types.ObjectId.isValid(doctor) || !mongoose.Types.ObjectId.isValid(patient)) {
            return res.status(400).json({ msg: 'Invalid ID format' });
        }

        const findConsultation = await Consultation.findById(consultation);
        if (!findConsultation) {
            return res.status(404).json({ msg: 'Consultation not found' });
        }

        const findDoctor = await Doctor.findById(doctor);
        if (!findDoctor) {
            return res.status(404).json({ msg: 'Doctor not found' });
        }

        const findPatient = await Patient.findById(patient);
        if (!findPatient) {
            return res.status(404).json({ msg: 'Patient not found' });
        }

        const newPrescription = await Prescription.create({
            consultation,
            doctor,
            patient,
            careToBeTaken,
            medicines,
            isPrescribed: true
        });

        res.status(201).json({ msg: 'Prescription created successfully', newPrescription });
    } catch (err) {
        console.log(err);
        console.error('Error creating prescription:', err);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

exports.getPrescriptionsByPatientId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid patient ID' });
        }

        const prescriptions = await Prescription.find({ patient: id })
            .populate('consultation')
            .populate('doctor')
            .populate('patient');

        if (prescriptions.length === 0) {
            return res.status(404).json({ msg: 'No prescriptions found for this patient' });
        }

        res.status(200).json(prescriptions);
    } catch (err) {
        console.error('Error fetching prescriptions:', err);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

exports.getPrescriptionsByDoctorsId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid patient ID' });
        }

        const prescriptions = await Prescription.find({ doctor: id })
            .populate('patient');

        if (prescriptions.length === 0) {
            return res.status(404).json({ msg: 'No prescriptions found for this doctor' });
        }

        res.status(200).json(prescriptions);
    } catch (err) {
        console.error('Error fetching prescriptions:', err);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

exports.updatePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { careToBeTaken, medicines } = req.body;

        // Check if all required fields are present
        if (!careToBeTaken || !medicines) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        // Validate prescription ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid prescription ID' });
        }

        // Update the prescription
        const updatedPrescription = await Prescription.findByIdAndUpdate(
            id,
            { careToBeTaken, medicines },
            { new: true } // Ensures the returned document is the updated one
        );

        if (!updatedPrescription) {
            return res.status(404).json({ msg: 'Prescription not found' });
        }

        res.status(200).json({ msg: 'Prescription updated successfully', updatedPrescription });
    } catch (err) {
        console.error('Error updating prescription:', err);
        res.status(500).json({ msg: 'Internal server error' });
    }
};
