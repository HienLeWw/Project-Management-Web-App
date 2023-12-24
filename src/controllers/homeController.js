require('dotenv').config()
const { db } = require('../config/database')
const User = require('../models/Users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Project = require('../models/Projects')


const handleErrors = (err) => {
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


const getHomepage = async (req, res) => {
    const Project_list = [];
    //const proID = list(res.locals.user.project_ID)
    for (let i = 0; i < res.locals.user.project_ID.length; i++) {
        console.log(res.locals.user.project_ID[i])
        const project = await Project.findById(res.locals.user.project_ID[i])
        Project_list.push(project);
    }
    console.log(Project_list)
    res.render('project.ejs', { 'project_list': Project_list })
}

const loginPage = (req, res) => {
    const { loginSuccess, loginError } = req.query;
    res.render('login', { loginSuccess, loginError });
};

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

// const loginRequest = async (req, res) => {
//     const { username, password } = req.body;
//     console.log(username);
//     try {
//         const user = await User.login(username, password);
//         const token = createToken(user._id);
//         res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
//         res.status(200).redirect('/');
//     }
//     catch (err) {
//         console.log(err)
//         res.status(400).redirect('/login');
//     }
// }
const loginRequest = async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).redirect('/?loginSuccess=true');
    } catch (err) {
        console.log(err);
        res.status(400).redirect('/login?loginError=true');
    }
};
const logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/')
}



module.exports = {
    getHomepage, loginPage, loginRequest, signUpPage, signUpRequest, logout
}