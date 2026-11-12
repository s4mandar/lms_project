import express from "express"
const router = express.Router()

import taskController from "../controllers/tasks.js"
import middleware from "../middlewares/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/tasks/:lessonId", authGuard, roleGuard("admin", "teacher"), middleware.checkId, taskController.getTaskByLessonId)
    .get("/tasks", authGuard, roleGuard("admin", "teacher"), taskController.getAllTasks)
    .post("/tasks", authGuard, roleGuard("teacher"), middleware.taskSchema, taskController.createTask)
    .put("/tasks/:lessonId", authGuard, roleGuard("teacher"), middleware.checkId, middleware.updateTaskSchema, taskController.updateTask)
    .delete("/tasks/:lessonId", authGuard, roleGuard("teacher"), middleware.checkId, taskController.deleteTask)

export default router