const express = require('express')
const router = express.Router()
const { getHomepage, loginPage, loginRequest, signUpPage, signUpRequest, logout } = require('../controllers/homeController')
const { requireAuth, checkUser } = require('../middleware/authMiddleware')

// route before login
router.get('/login', loginPage)
router.post('/login', loginRequest)
router.get('/signup', signUpPage)
router.post('/signup', signUpRequest)
router.post('/logout', logout)

// route after login
router.get('/', requireAuth, checkUser, getHomepage)



module.exports = router