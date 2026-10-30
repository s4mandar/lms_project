import staffRouter from "../routers/staff.js"
import authRouter from "../routers/auth.js"
import { Router } from "express"

const main = Router()

main
    .use("/api/v1", staffRouter)
    .use("/api/v1", authRouter)

export default main