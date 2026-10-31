import express from "express"
const router = express.Router()
import categoryController from "../controllers/categories.js"
import middleware from "../middlewares/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/categories", authGuard, roleGuard("admin"), categoryController.getAllCategories)
    .post("/categories", authGuard, roleGuard("admin"), middleware.createCategory, categoryController.createCategory)

export default router