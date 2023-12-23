const express = require('express')
const router = express.Router()
const { requireAuth, checkUser } = require('../middleware/authMiddleware')
const { Create_Project, Delete_Project, getProjects } = require('../controllers/Project_Controller')

router.post('/Projects/project', requireAuth, checkUser, Create_Project);


//api
router.get('/workspace/Projects', requireAuth, checkUser, getProjects);
module.exports = router