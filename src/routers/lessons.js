import express from "express"
const router = express.Router()

import lessonController from "../controllers/lessons.js"
import middleware from "../middlewares/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/lessons/:sectionId", authGuard, roleGuard("admin", "teacher"), lessonController.getLessonsBySectionId)
    .get("/lessons", authGuard, roleGuard("teacher", "admin"), lessonController.getAllLessons)
    .post("/lessons", authGuard, roleGuard("teacher"), middleware.lessonSchema, lessonController.createLesson)
    .put("/lessons/:id", authGuard, roleGuard("teacher", "admin"), middleware.updateLessonSchema, lessonController.updateLesson)
    .delete("/lessons/:id", authGuard, roleGuard("teacher", "admin"), lessonController.deleteLesson)

export default router