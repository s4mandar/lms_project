import express from "express"
const router = express.Router()

import teacherController from "../controllers/teachers.js"
import { authGuard } from "../guards/auth.guard.js"

router
    .post("/teachers", authGuard, teacherController.createTeacher)