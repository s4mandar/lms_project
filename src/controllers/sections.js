import sectionService from "../services/sections.js"

class SectionController {
    async getAllSections(req, res, next) {
        let resData = await sectionService.getAllSections()
        return res.status(resData.status).json(resData)
    }
    async createSections(req, res, next) {
        let resData = await sectionService.createSection(req, res, next)

        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async updateSection(req, res, next) {
        let resData = await sectionService.updateSection(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async deleteSection(req, res, next) {
        let resData = await sectionService.deleteSection(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }
}

const sectionController = new SectionController()

export default sectionController