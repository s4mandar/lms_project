import studentService from "../services/students.js"

class StudentController {
    async getAllStudents(req, res, next) {
        let resData = await studentService.getAllStudents()
        return res.status(resData.status).json(resData)
    }

    async getMyAllCourses(req, res, next) {
        let resData = await studentService.getMyAllCourses(req, res, next)

        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async createStudent(req, res, next) {
        let resData = await studentService.createStudent(req, res, next)

        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }
    async updateStudentbyId(req, res, next) {
        let resData = await studentService.updateStudentbyId(req, res, next)

        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async deleteStudent(req, res, next) {
        let resData = await studentService.deleteStudent(req, res, next)

        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

}

const studentController = new StudentController()

export default studentController