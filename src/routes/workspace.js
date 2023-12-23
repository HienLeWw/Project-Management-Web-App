const express = require('express')
const router = express.Router()
const { requireAuth, checkUser } = require('../middleware/authMiddleware')
const { Create_Project, Delete_Project } = require('../controllers/eventsController')

router.post('/workspace/createEvents', requireAuth, checkUser, Create_Project);
router.post('/workspace/updateEvents', requireAuth, checkUser, Create_Project);
module.exports = router