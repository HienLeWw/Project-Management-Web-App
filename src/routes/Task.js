const express = require('express')
const router = express.Router()
const { requireAuth, checkUser } = require('../middleware/authMiddleware')
const { authorization } = require('../middleware/authorizationMiddleware')
const { getTaskPage, TaskCreate, ModTaskContent, getTask, deleteTask } = require('../controllers/TaskController')

router.get("/Projects/Tasks", requireAuth, checkUser, authorization, getTaskPage)
router.post("/Projects/Tasks", requireAuth, checkUser, authorization, TaskCreate)
router.get("/Projects/Tasks/Task", requireAuth, checkUser, authorization, getTask)
router.put("/Projects/Tasks", requireAuth, checkUser, authorization, ModTaskContent)
router.post("/Projects/Tasks/Delete", requireAuth, checkUser, authorization, deleteTask)

// "/Projects"
// "/Projects/Project"

module.exports = router