const Consultation = require("../models/consultationModel");
const Patient = require("../models/patientModel");
const Doctor = require("../models/doctorModel");

exports.createConsultation = async (req, res) => {
    try {
        const { doctor, currentIllness, recentSurgery, familyMedicalHistory, patient } = req.body;

        if (!doctor || !currentIllness) {
            return res.status(400).json({ msg: "Doctor ID and Current Illness are required" });
        }

        const findPatient = await Patient.findById(patient);
        if (!findPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const findDoctor = await Doctor.findById(doctor);
        if (!findDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const newConsultation = await Consultation.create({
            patient,
            doctor,
            currentIllness,
            recentSurgery,
            familyMedicalHistory
        });

        res.json({ msg: 'Consultation registered successfully', newConsultation });
    } catch (err) {
        console.error('Error creating consultation:', err);
        res.status(500).json({ msg: 'Internal server error' });
    }
}


exports.updateConsultations = async (req, res) => {
    try {
        const { patientId } = req.user

        const update = req.body

        if (!update._id) {
            return res.status(400).json({ msg: "Consultation ID is required" });
        }

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'patient not found' });
        }

        Consultation.findByIdAndUpdate(update._id, update).then(() => {
            res.status(200).json({ msg: 'consultation updated successfully' });
        }).catch(err => {
            res.status(500).json({ msg: 'Failed to update the consultation', err });
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Failed to update the consultation', err });
    }

}

exports.findConsultationById = async (req, res) => {
    try {
        const { id } = req.params;

        const consultation = await Consultation.findById(id)
            .populate({
                path: 'patient',
                select: 'name age profilePicture',
            })
            .populate({
                path: 'prescription',
                select: 'isPrescribed'
            });;

        if (!consultation) {
            return res.status(404).json({ msg: 'Consultation not found' });
        }

        res.json(consultation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Unable to find the consultation' });
    }
};
