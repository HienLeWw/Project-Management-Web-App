const express = require('express')
const router = express.Router()
const { requireAuth, checkUser } = require('../middleware/authMiddleware')
const { Create_Project, Delete_Project, getProjects } = require('../controllers/Project_Controller')

router.post('/workspace/project/invite/:id', requireAuth, checkUser, Create_Project);


//api
router.get('/workspace/getProjects', requireAuth, checkUser, getProjects);
module.exports = router