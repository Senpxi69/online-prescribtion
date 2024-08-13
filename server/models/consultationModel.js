const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient', // Reference to the Patient model
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor', // Reference to the Doctor model
        required: true,
    },
    currentIllness: {
        type: String,
        required: true,
    },
    recentSurgery: {
        type: String,
        required: false,
    },
    familyMedicalHistory: {
        diabetics: {
            type: Boolean,
            required: true,
        },
        allergies: {
            type: String,
            required: false,
        },
        others: {
            type: String,
            required: false,
        },
    },
}, {
    timestamps: true,
});

const Consultation = mongoose.model('Consultation', consultationSchema);

module.exports = Consultation;
