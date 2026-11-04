import assistService from "../services/assists.js"

class AssistController {
    async createAssist(req, res, next) {
        let resData = await assistService.createAssist(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async getAllAssists(req, res, next) {
        let resData = await assistService.getAllAssists(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async getAssistByAssistId(req, res, next) {
        let resData = await assistService.getAssistByAssistId(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async updateAssistById(req, res, next) {
        let resData = await assistService.updateAssistById(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async deleteAssist(req, res, next) {
        let resData = await assistService.deleteAssist(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }
}

const assistController = new AssistController()

export default assistController