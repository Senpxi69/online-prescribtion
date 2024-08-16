const express = require('express')
const mongoose = require('mongoose')
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const consultationRoutes = require('./routes/consultationRoutes')
const prescriptionRoutes = require('./routes/prescribtionRoutes')
const cors = require('cors')

const app = express();
const port = 5000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

mongoose.connect("mongodb://localhost:27017/online-prescription", {
}).then(() => {
    console.log("DB connection succesfull");
}).catch(error => {
    console.log(error)
})

app.use('/doctors', doctorRoutes)
app.use('/patients', patientRoutes)
app.use('/consultations', consultationRoutes)
app.use('/prescriptions', prescriptionRoutes)

app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})