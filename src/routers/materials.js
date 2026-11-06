import express from "express"
const router = express.Router()

import materialController from "../controllers/materials.js"
import middleware from "../middlewares/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/materials/:lessonId", authGuard, roleGuard("admin", "teacher"), materialController.getMaterialByLessonId)
    .get("/materials", authGuard, roleGuard("teacher", "admin"), materialController.getAllMaterials)
    .post("/materials", authGuard, roleGuard("teacher", "admin"), middleware.materialSchema, materialController.createMaterial)
    .put("/materials/:id", authGuard, roleGuard("teacher", "admin"), middleware.updateMaterialSchema, materialController.updateMaterial)
    .delete("/materials/:id", authGuard, roleGuard("teacher"), materialController.deleteMaterial)

export default router