import express from "express"
const router = express.Router()

import assistController from "../controllers/assists.js"
import middleware from "../middlewares/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/assists", authGuard, roleGuard("admin"), assistController.getAllAssists)
    .get("/assists/:assistId", authGuard, roleGuard("admin"), assistController.getAssistByAssistId)
    .post("/assists", authGuard, roleGuard("admin"), middleware.assistSchema, assistController.createAssist)
    .delete("/assists/:assistId", authGuard, roleGuard("admin"), assistController.deleteAssist)
    .put("/assists/:assistId", authGuard, middleware.assistUpdateSchema, assistController.updateAssistById)

export default router