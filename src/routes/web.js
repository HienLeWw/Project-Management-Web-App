const express = require('express')
const router = express.Router()
const { getHomepage, loginPage, loginRequest, signUpPage, signUpRequest, logout, getWorkspace, test } = require('../controllers/homeController')
const { requireAuth, checkUser } = require('../middleware/authMiddleware')
router.get('/', getHomepage)
router.get('/login', loginPage)
router.post('/login', loginRequest)
router.get('/signup', signUpPage)
router.post('/signup', signUpRequest)
router.post('/logout', logout)
router.get('/workspace', requireAuth, checkUser, getWorkspace)

module.exports = router