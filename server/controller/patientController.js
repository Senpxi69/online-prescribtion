const bcrypt = require("bcrypt");
const Patient = require('../models/patientModel');
const Consultation = require('../models/consultationModel')
const { createToken } = require('../utils/jwt');

exports.signup = async (req, res) => {
    try {
        const { profilePicture, name, email, phoneNumber, password, age, } = req.body;

        if (!profilePicture || !name || !email || !phoneNumber || !password || !age) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const emailCheck = await Patient.findOne({ email });
        if (emailCheck) {
            return res.json({ msg: "Email already taken, try another", status: false });
        }

        const phoneNumberCheck = await Patient.findOne({ phoneNumber });
        if (phoneNumberCheck) {
            return res.json({ msg: "Phone number already taken, try another", status: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newPatient = await Patient.create({
            profilePicture,
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            age,
        });

        res.status(201).json({ message: 'Patient registered successfully', newPatient });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Patient registration failed' });
    }
}

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "All fields are required", status: false });
        }

        const patient = await Patient.findOne({ email });

        if (!patient) {
            return res.status(404).json({ msg: "Invalid credentials", status: false });
        }

        const isPasswordValid = await bcrypt.compare(password, patient.password);

        if (!isPasswordValid) {
            return res.status(400).json({ msg: "Invalid credentials", status: false });
        }

        delete patient.password

        const token = createToken({ _id: patient._id });

        return res.json({ token, patientId: patient._id, status: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Sign-in failed' });
    }
};


exports.getPatients = async (req, res) => {
    try {
        const patient = await Patient.find({});

        if (patient.length === 0) {
            return res.status(404).json({ message: 'patients not found' });
        }

        res.status(200).json({ message: 'fetchin patients successful', patient });

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Failed to fetch the patients' })
    }
}

exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({ message: 'patient not found' });
        }

        res.status(200).json({ message: 'patient Found', patient });

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Failed to fetch the patient' })
    }
}

exports.updatePatient = async (req, res) => {
    try {
        const patientId = req.params.id
        const update = req.body;

        if (!patientId || !update) {
            return res.status(400).json({ msg: 'Patient ID and update data are required' });
        }

        const existingPatient = await Patient.findById(patientId);
        if (!existingPatient) {
            return res.status(404).json({ msg: 'Patient not found' });
        }

        const emailCheck = await Patient.findOne({ email: update.email });
        if (emailCheck) {
            return res.json({ msg: "Email already taken, try another", status: false });
        }

        const phoneNumberCheck = await Patient.findOne({ phoneNumber: update.phoneNumber });
        if (phoneNumberCheck) {
            return res.json({ msg: "Phone number already taken, try another", status: false });
        }

        if (update.password) {
            const hashedPassword = await bcrypt.hash(update.password, 10);
            update.password = hashedPassword;
        }

        await Patient.findByIdAndUpdate(patientId, update).then(() => {
            res.status(200).json({ msg: 'patient updated successfully' })
        }).catch(err => {
            res.status(500).json({ msg: 'Failed to update the patient', err })
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Failed to update the patient' })
    }
}

exports.patientsConsultation = async (req, res) => {
    try {
        const patientId = req.user._id;

        const consultations = await Consultation.find({ patient: patientId })
            .populate('doctor', 'name speciality')
            .exec();

        if (!consultations || consultations.length === 0) {
            return res.status(404).json({ msg: 'No consultations found for this patient' });
        }

        res.json(consultations);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to get the patient\'s consultations' });
    }
};