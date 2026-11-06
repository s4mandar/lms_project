import examService from "../services/exams.js"

class ExamController {
    constructor() { }

    async getExamByLessonId(req, res, next) {
        let resData = await examService.getExamByLessonId(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async getAllExams(req, res, next) {
        let resData = await examService.getAllExams(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async createExam(req, res, next) {
        let resData = await examService.createExam(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async updateExam(req, res, next) {
        let resData = await examService.updateExam(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async deleteExam(req, res, next) {
        let resData = await examService.deleteExam(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }
}

const examController = new ExamController()

export default examController