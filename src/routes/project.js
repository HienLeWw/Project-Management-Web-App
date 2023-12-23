const express = require('express')
const router = express.Router()
const { requireAuth, checkUser } = require('../middleware/authMiddleware')
const { Create_Project, Delete_Project, getProjects, projectPage } = require('../controllers/Project_Controller')
const { authorization } = require('../middleware/authorizationMiddleware')
router.post('/Projects/project', requireAuth, checkUser, Create_Project);
router.get('/Projects/project', requireAuth, checkUser, authorization, projectPage);

//api
router.get('/Projects', requireAuth, checkUser, getProjects);
module.exports = router