import express from "express"
const router = express.Router()
import studentController from "../controllers/students.js"
import middleware from "../middlewares/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/students", authGuard, roleGuard("admin"), studentController.getAllStudents)
    .post("/students", middleware.createStudent, studentController.createStudent)

export default router