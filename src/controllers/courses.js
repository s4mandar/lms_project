import coursesService from "../services/courses.js"

class CoursesController {
    async getAllCourses(req, res, next) {
        let resData = await coursesService.getAllCourses()
        return res.status(resData.status).json(resData)
    }

    async getMyCourses(req, res, next) {
        let resData = await coursesService.getMyCourses(req, res, next)

        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }
    
    async createCourse(req, res, next) {
        let resData = await coursesService.createCourse(req, res, next)

        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }
    async updateCourse(req, res, next) {
        let resData = await coursesService.updateCourse(req, res, next)

        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }
    async deleteCourse(req, res, next) {
        let resData = await coursesService.deleteCourse(req, res, next)

        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async courseApproved(req, res, next) {
        let resData = await coursesService.courseApproved(req, res, next)

        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }
}

const coursesController = new CoursesController()

export default coursesController