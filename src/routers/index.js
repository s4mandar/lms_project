import staffRouter from "../routers/staff.js"
import authRouter from "../routers/auth.js"
import teacherRouter from "../routers/teachers.js"
import studentRouter from "../routers/students.js"
import categoryRouter from "../routers/categories.js"
import coursesRouter from "../routers/courses.js"
import { Router } from "express"

const main = Router()

main
    .use("/api/v1", staffRouter)
    .use("/api/v1", authRouter)
    .use("/api/v1", teacherRouter)
    .use("/api/v1", studentRouter)
    .use("/api/v1", categoryRouter)
    .use("/api/v1", coursesRouter)

export default main