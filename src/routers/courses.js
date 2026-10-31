import express from "express"
const router = express.Router()
import courseController from "../controllers/courses.js"
import middleware from "../middlewares/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/courses", authGuard, roleGuard("admin"), courseController.getAllCourses)
    .post("/courses",authGuard, roleGuard("admin", "teacher"), middleware.createCourse, courseController.createCourse)

export default router