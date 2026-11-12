import express from "express"
const router = express.Router()
import staffController from "../controllers/staff.js"
import validationMiddleware from "../middlewares/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/staff", authGuard, roleGuard("admin"), staffController.getAllStaff)
    .post("/staff", authGuard, roleGuard("admin"), validationMiddleware.staffSchema, staffController.createStaff)
    .put("/staff/:userId", authGuard, roleGuard("admin"), validationMiddleware.checkId, validationMiddleware.staffUpdateSchema, staffController.updateStaff)
    .delete("/staff/:userId", authGuard, roleGuard("admin"), validationMiddleware.checkId, staffController.deleteStaff)

export default router