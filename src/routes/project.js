const express = require('express')
const router = express.Router()
const { requireAuth, checkUser } = require('../middleware/authMiddleware')

const { Create_Project, Delete_Project, getProjects, projectPage, memberPage, getAllMembers, calendarPage } = require('../controllers/Project_Controller')
const { authorization } = require('../middleware/authorizationMiddleware')
router.post('/Projects/project', requireAuth, checkUser, Create_Project);
router.get('/Projects/project', requireAuth, checkUser, authorization, projectPage);
router.get('/Projects/members', requireAuth, checkUser, authorization, memberPage)
router.get('/Projects/calendar', requireAuth, checkUser, authorization, calendarPage)
//api
router.get('/Projects', requireAuth, checkUser, getProjects); // get all project of an user
router.get('/Projects/project/members', requireAuth, checkUser, authorization, getAllMembers) // get all member of a project

module.exports = router