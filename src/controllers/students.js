import studentService from "../services/students.js"

class StudentController {
    async getAllStudents(req, res, next) {
        let resData = await studentService.getAllStudents()
        return res.status(resData.status).json(resData)
    }
    async createStudent(req, res, next) {
        let resData = await studentService.createStudent(req, res, next)

        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

}

const studentController = new StudentController()

export default studentController