require('dotenv').config();
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'please enter an email'],
        unique: [true, 'this email is already existed'],
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    username: {
        type: String,
        required: [true, 'please enter an username'],
        unique: [true, 'this username is already existed'],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'please enter a password'],
        minLength: [6, 'Minimum password length is 6 characters']
    },
    project_ID: {
        type: [String]
    },
    notification: {
        type: [Object]
    }
});

userSchema.pre('save', async function (next) {
    const salt = process.env.SALT_SECRET
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function (username, password) {
    const user = await this.findOne({ 'username': username });
    if (user) {
        console.log(password, user.password);
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect username');
}

const User = mongoose.model('Users', userSchema);
module.exports = User;