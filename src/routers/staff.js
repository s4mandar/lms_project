import express from "express"
const router = express.Router()
import staffController from "../controllers/staff.js"
import validationMiddleware from "../middlewares/validation.js"
import { authGuard } from "../guards/auth.guard.js"

router
    .get("/staff", authGuard, staffController.getAllStaff)
    .post("/staff", validationMiddleware.staffCreate, staffController.createStaff)
    .delete("/staff/:userId", staffController.deleteStaff)

export default router