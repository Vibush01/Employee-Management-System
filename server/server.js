const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const employeeRoutes = require('./routes/employees');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect( process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/api/employees', employeeRoutes);

app.get('/', (req, res) => {
    res.send('Testing backend');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
