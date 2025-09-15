const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    image: String,
    wallet: { type: String, unique: true },
    // store inbuilt wallet secret key as array of numbers (Uint8Array)
    secret: { type: [Number], select: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
