import { ErrorException } from "../utils/error.js"
import schema from "../utils/validation.js"

export default {
    staffCreate: (req, res, next) => {
        let { error } = schema.staffSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    createStudent: (req, res, next) => {
        let { error } = schema.studentSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    createCategory: (req, res, next) => {
        let { error } = schema.categorySchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    createCourse: (req, res, next) => {
        let { error} = schema.courseSchema.validate(req.body)
        if(error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    }
}