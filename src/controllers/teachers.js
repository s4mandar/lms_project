import teacherService from "../services/teachers.js"

class TeacherController {
    async createTeacher(req, res, next) {
        let resData = await teacherService.createTeacher(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async getAllTeachers(req, res, next) {
        let resData = await teacherService.getAllTeachers(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async getTeacherByTeacherId(req, res, next) {
        let resData = await teacherService.getTeacherByTeacherId(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async updateTeacherbyId(req, res, next) {
        let resData = await teacherService.updateTeacherbyId(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async deleteTeacher(req, res, next) {
        let resData = await teacherService.deleteTeacher(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }
}

const teacherController = new TeacherController()

export default teacherController