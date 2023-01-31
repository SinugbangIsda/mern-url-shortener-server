const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortened_url: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true
    },
}, { timestamps: true });

const URL = mongoose.model('url', urlSchema);

module.exports = URL;