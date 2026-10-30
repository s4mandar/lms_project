import staffRouter from "../routers/staff.js"
import authRouter from "../routers/auth.js"
import teacherRouter from "../routers/teachers.js"
import { Router } from "express"

const main = Router()

main
    .use("/api/v1", staffRouter)
    .use("/api/v1", authRouter)
    .use("/api/v1", teacherRouter)

export default main