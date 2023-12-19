require('dotenv').config()
const { db } = require('../config/database')
const User = require('../models/Users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '', username: '' };

    //duplicate error code
    if (err.code === 11000) {
        if (err.message.includes('email')) {
            errors.email = 'that email is already registered';
        }
        else if (err.message.includes('username')) {
            errors.username = 'that ussername is already registered';
        }
        return errors;
    }

    //validation errors
    if (err.message.includes('Users validation failed:')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: maxAge
    });
}


const getHomepage = (req, res) => {
    res.render('project.ejs');
}

const loginPage = (req, res) => {
    res.render('login.ejs');
}

const signUpPage = (req, res) => {
    res.render('register.ejs')
}

const signUpRequest = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const user = await User.create({ email, username, password });
        res.status(201).redirect('/login');
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const loginRequest = async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).redirect('/workspace');
    }
    catch (err) {
        console.log(err)
        res.status(400).redirect('/login');
    }
}
const logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/')
}

const getWorkspace = (req, res) => {
    res.render('home.ejs')
}

module.exports = {
    getHomepage, loginPage, loginRequest, signUpPage, signUpRequest, logout, getWorkspace
}