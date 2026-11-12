import express from "express"
const router = express.Router()

import teacherController from "../controllers/teachers.js"
import middleware from "../middlewares/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/teachers", teacherController.getAllTeachers)
    .get("/teachers/:teacherId", authGuard, roleGuard("admin"), middleware.checkId, teacherController.getTeacherByTeacherId)
    .post("/teachers", authGuard, roleGuard("admin"), middleware.teacherSchema, teacherController.createTeacher)
    .delete("/teachers/:userId", authGuard, roleGuard("admin"), middleware.checkId, teacherController.deleteTeacher)
    .put("/teachers/:userId", authGuard, roleGuard("admin"), middleware.checkId, middleware.teacherUpdateSchema, teacherController.updateTeacherbyId)

export default router