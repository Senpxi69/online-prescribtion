const Prescription = require('../models/prescribtionModel');
const Consultation = require('../models/consultationModel');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');

exports.createPrescription = async (req, res) => {
    try {
        const { consultation, careToBeTaken, medicines, doctor, patient } = req.body;

        const findConsultation = await Consultation.findById(consultation);
        if (!findConsultation) {
            return res.status(404).json({ msg: 'Consultation not found' });
        }

        const findDoctor = await Doctor.findById(doctor);
        if (!findDoctor) {
            return res.status(404).json({ msg: 'Doctor not found' });
        }

        const FindPatient = await Patient.findById(patient);
        if (!FindPatient) {
            return res.status(404).json({ msg: 'Patient not found' });
        }

        const newPrescription = await Prescription.create({
            consultation,
            doctor,
            patient,
            careToBeTaken,
            medicines
        });

        res.status(201).json({ msg: 'Prescription created successfully', newPrescription });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

exports.getPrescriptionsByPatientId = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const prescriptions = await Prescription.find({ patient: id })
            .populate('consultation')
            .populate('doctor')
            .populate('patient');

        if (prescriptions.length === 0) {
            return res.status(500).json({ msg: 'No prescriptions found for this patient' });
        }

        res.json(prescriptions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
};


exports.updatePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { careToBeTaken, medicines } = req.body;

        const updatedPrescription = await Prescription.findByIdAndUpdate(
            id,
            { careToBeTaken, medicines },
        );

        if (!updatedPrescription) {
            return res.status(404).json({ msg: 'Prescription not found' });
        }

        res.json({ msg: 'Prescription updated successfully', updatedPrescription });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
};
