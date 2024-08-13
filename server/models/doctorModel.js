const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    profilePicture: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    speciality: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    yearsOfExperience: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
