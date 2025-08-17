const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    wallet: { type: String, unique: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;