const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    profilePicture: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
