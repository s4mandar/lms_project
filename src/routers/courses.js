import express from "express"
const router = express.Router()
import courseController from "../controllers/courses.js"
import middleware from "../middlewares/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/courses", courseController.getAllCourses)
    .get("/courses/my", authGuard, roleGuard("teacher"), courseController.getMyCourses)
    .get("/courses/:id", middleware.checkId, courseController.getCoursesByCategoryId)
    .post("/courses", authGuard, roleGuard("teacher"), middleware.createCourse, courseController.createCourse)
    .put("/courses/approved/:courseId", authGuard, roleGuard("admin"), middleware.checkId, courseController.courseApproved)
    .put("/courses/:id", authGuard, roleGuard("teacher"), middleware.checkId, middleware.UpdateCourseSchema, courseController.updateCourse)
    .delete("/courses/:id", authGuard, roleGuard("teacher"), middleware.checkId, courseController.deleteCourse)

export default router