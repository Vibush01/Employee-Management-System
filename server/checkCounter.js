const mongoose = require('mongoose');
const Counter = require('./models/Counter');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const counters = await Counter.find({});
        console.log('All Counters:', JSON.stringify(counters, null, 2));
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
