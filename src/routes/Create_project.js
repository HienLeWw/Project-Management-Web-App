const express = require('express')
const router = express.Router()
const { requireAuth, checkUser } = require('../middleware/authMiddleware')
const { Create_Project, Delete_Project } = require('../controllers/Project_Controller')

router.post('/projects_workspace', requireAuth, checkUser, Create_Project);

module.exports = router