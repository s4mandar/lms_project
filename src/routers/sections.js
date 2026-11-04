import express from "express"
const router = express.Router()
import sectionController from "../controllers/sections.js"
// import middleware from "../middlewares/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/sections", authGuard, roleGuard("teacher"), sectionController.getAllSections)
    .get("/sections/:courseId", authGuard, roleGuard("teacher"), sectionController.getSections)
    .post("/sections", authGuard, roleGuard("teacher"), sectionController.createSections)
    .put("/sections/:userId", authGuard, roleGuard("teacher", "admin"), sectionController.updateSection)
    .delete("/sections/:userId", authGuard, roleGuard("teacher", "admin"), sectionController.deleteSection)

export default router