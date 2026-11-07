import express from "express"
const router = express.Router()
import studentController from "../controllers/students.js"
import middleware from "../middlewares/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/students", authGuard, roleGuard("admin"), studentController.getAllStudents)
    .get("/students/my/courses", authGuard, roleGuard("student"), studentController.getMyAllCourses)
    .post("/students",authGuard, roleGuard("admin"), middleware.createStudent, studentController.createStudent)
    .delete("/students/:userId",authGuard, roleGuard("admin"), studentController.deleteStudent)
    .put("/students/:userId",authGuard, roleGuard("admin"), middleware.UpdateStudentSchema, studentController.updateStudentbyId)

export default router