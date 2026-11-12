import express from "express"
const router = express.Router()
import sectionController from "../controllers/sections.js"
import middleware from "../middlewares/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/sections", sectionController.getAllSections)
    .get("/sections/:courseId", authGuard, roleGuard("teacher", "admin", "student"), middleware.checkId, sectionController.getSections)
    .post("/sections", authGuard, roleGuard("teacher"), middleware.sectionSchema, sectionController.createSections)
    .put("/sections/:userId", authGuard, roleGuard("teacher", "admin"), middleware.checkId, middleware.updateSectionSchema, sectionController.updateSection)
    .delete("/sections/:userId", authGuard, roleGuard("teacher", "admin"), middleware.checkId, sectionController.deleteSection)

export default router