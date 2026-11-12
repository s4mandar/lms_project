import express from "express"
const router = express.Router()

import examController from "../controllers/exams.js"
import middleware from "../middlewares/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/exams/:lessonId", authGuard, roleGuard("admin", "teacher"), middleware.checkId, examController.getExamByLessonId)
    .get("/exams", authGuard, roleGuard("admin", "teacher"), examController.getAllExams)
    .post("/exams", authGuard, roleGuard("teacher"), middleware.examSchema, examController.createExam)
    .put("/exams/:examId", authGuard, roleGuard("teacher"), middleware.checkId, middleware.updateExamSchema, examController.updateExam)
    .delete("/exams/:examId", authGuard, roleGuard("teacher"), middleware.checkId, examController.deleteExam)

export default router