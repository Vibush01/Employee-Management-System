const mongoose = require('mongoose');
const Counter = require('./models/Counter');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        // Reset the counter to 2511980000
        await Counter.findOneAndUpdate(
            { _id: 'employeeId' },
            { seq: 2511980000 },
            { upsert: true, new: true }
        );
        console.log('Counter reset to 2511980000');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
