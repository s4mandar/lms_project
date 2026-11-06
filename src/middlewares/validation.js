import { ErrorException } from "../utils/error.js"
import schema from "../utils/validation.js"

export default {
    staffSchema: (req, res, next) => {
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
    },
    staffUpdateSchema: (req, res, next) => {
        let { error } = schema.staffUpdateSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    UpdateStudentSchema : (req, res, next) => {
        let { error } = schema.UpdateStudentSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    updateCategory : (req, res, next) => {
        let { error } = schema.UpdateCategorySchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    UpdateCourseSchema: (req, res, next) => {
        let { error } = schema.UpdateCourseSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    lessonSchema: (req, res, next) => {
        let { error } = schema.lessonSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    updateLessonSchema: (req, res, next) => {
        let { error } = schema.updateLessonSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    teacherSchema: (req, res, next) => {
        let { error } = schema.teacherSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    teacherUpdateSchema: (req, res, next) => {
        let { error } = schema.teacherUpdateSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    assistSchema : (req, res, next) => {
        let { error } = schema.assistSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    assistUpdateSchema : (req, res, next) => {
        let { error } = schema.assistUpdateSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    taskSchema: (req, res, next) => {
        let { error } = schema.taskSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    updateTaskSchema: (req, res, next) => {
        let { error } = schema.taskSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    materialSchema: (req, res, next) => {
        let { error } = schema.materialSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    updateMaterialSchema: (req, res, next) => {
        let { error } = schema.updateMaterialSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    sectionSchema: (req, res, next) => {
        let { error } = schema.sectionSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    updateSectionSchema: (req, res, next) => {
        let { error } = schema.updateSectionSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    examSchema: (req, res, next) => {
        let { error } = schema.examSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
    updateExamSchema: (req, res, next) => {
        let { error } = schema.updateExamSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
    },
}