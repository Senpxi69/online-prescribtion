const bcrypt = require("bcrypt");
const Doctor = require('../models/doctorModel');
const Consultation = require('../models/consultationModel')
const Prescription = require('../models/prescribtionModel')
const { createToken } = require('../utils/jwt');

exports.signup = async (req, res) => {
    try {
        const { profilePicture, name, speciality, yearsOfExperience, email, phoneNumber, password } = req.body;
        if (!profilePicture || !name || !speciality || !yearsOfExperience || !email || !phoneNumber || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const emailCheck = await Doctor.findOne({ email });
        if (emailCheck) {
            return res.json({ msg: "email alreday taken try with another one", status: false })
        }

        const checkNumber = await Doctor.findOne({ phoneNumber });
        if (checkNumber) {
            return res.json({ msg: "email alreday taken try with another one", status: false })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newDoctor = await Doctor.create({
            profilePicture,
            name,
            speciality,
            yearsOfExperience,
            email,
            phoneNumber,
            password: hashedPassword
        })

        delete newDoctor.password

        res.status(201).json({ message: 'Doctor registered successfully', doctor: newDoctor._id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Doctor registration failed' })
    }
}

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await Doctor.findOne({ email })

        if (!email || !password) {
            return res.status(400).json({ msg: "All fields are required", status: false });
        }

        if (!doctor) {
            return res.json({ msg: "invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, doctor.password);

        if (!isPasswordValid) {
            return res.json({ msg: "incorrect doctorname or password", status: false });
        }

        delete doctor.password;

        const token = createToken({ _id: doctor._id })

        return res.json({ token, doctor: doctor._id, status: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Sign-in failed' });
    }
};


exports.getProfile = async (req, res) => {
    try {
        const doctor = await Doctor.find({});

        if (doctor.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({ message: 'fetchin doctors successful', doctor });

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Failed to fetch the doctors' })
    }
}

exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({ message: 'Doctor Found', doctor });

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Failed to fetch the doctor' })
    }
}

exports.viewConsultation = async (req, res) => {
    try {

        const consultation = await Consultation.find({ doctor: req.params.id }).populate('patient', 'name email')

        res.status(200).json(consultation);

    } catch (err) {
        res.status(500).json({ msg: 'Failed to fetch the consultation' })
    }
}

exports.createPrescription = async (req, res) => {
    try {
        const { consultationId, careToBeTaken, medicines } = req.body;

        const newPrescription = await Prescription.create({
            consultation: consultationId,
            doctor: req.doctor.id,
            patient: (await Consultation.findById(consultationId)).patient,
            careToBeTaken,
            medicines
        });

        res.status(201).json({ message: 'Prescription created successfully', newPrescription });
    } catch (error) {
        res.status(500).json({ message: 'Error creating prescription', error });
    }
};