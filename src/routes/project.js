const express = require('express')
const router = express.Router()
const { requireAuth, checkUser } = require('../middleware/authMiddleware')

const { Create_Project, Delete_Project, getProjects, projectPage, memberPage, getAllInfo, calendarPage, inviteUser, leaveProject } = require('../controllers/Project_Controller')
const { authorization } = require('../middleware/authorizationMiddleware')

router.get('/Projects/project', requireAuth, checkUser, authorization, projectPage);
router.get('/Projects/members', requireAuth, checkUser, authorization, memberPage)
router.get('/Projects/calendar', requireAuth, checkUser, authorization, calendarPage)
//api
router.post('/Projects/project', requireAuth, checkUser, Create_Project); // create project
router.get('/Projects', requireAuth, checkUser, getProjects); // get all project of an user
router.get('/Projects/project/info', requireAuth, checkUser, authorization, getAllInfo); // get all member of a project
router.put('/Projects/project', requireAuth, checkUser, authorization, inviteUser);
router.post('/Projects/project/leave', requireAuth, checkUser, authorization, leaveProject);
module.exports = router