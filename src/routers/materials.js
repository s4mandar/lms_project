import express from "express"
const router = express.Router()

import materialController from "../controllers/materials.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/materials/:lessonId", authGuard, roleGuard("admin", "teacher"), materialController.getMaterialByLessonId)
    .get("/materials", authGuard, roleGuard("teacher", "admin"), materialController.getAllMaterials)
    .post("/materials", authGuard, roleGuard("teacher"), materialController.createMaterial)
    // .put("/materials/:lessonId", authGuard, roleGuard("teacher"), materialController.updateMaterial)
    // .delete("/materials/:lessonId", authGuard, roleGuard("teacher"), materialController.deleteMaterial)

export default router