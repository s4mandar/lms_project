import Joi from "joi"

export default {
    staffSchema: Joi.object({
        fullname: Joi.string().min(3).max(30).required(),
        phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/).required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().required()
    }),
    studentSchema: Joi.object({
        fullname: Joi.string().min(3).max(30).required(),
        phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/).required(),
        password: Joi.string().min(6).required()
    }),
    categorySchema: Joi.object({
        name: Joi.string().min(3).max(30).required()
    }),
    courseSchema: Joi.object({
        name: Joi.string().min(3).max(30).required(),
        description: Joi.string().max(500),
        level: Joi.string().pattern(/^(beginner|elementary|intermadiate|advanced)$/).required(),
        price: Joi.string().pattern(/^\d+$/).required(),
        category_id: Joi.number().integer().positive().required()
    }),
    staffUpdateSchema: Joi.object({
        fullname: Joi.string().min(3).max(30),
        phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/),
        password: Joi.string().min(6),
        role: Joi.string()
    }),
    UpdateStudentSchema: Joi.object({
        fullname: Joi.string().min(3).max(30),
        phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/),
        password: Joi.string().min(6)
    }),
    UpdateCategorySchema: Joi.object({
        name: Joi.string().min(3).max(30)
    }),
    UpdateCourseSchema: Joi.object({
        name: Joi.string().min(3).max(30),
        description: Joi.string().max(500),
        level: Joi.string().pattern(/^(beginner|elementary|intermadiate|advanced)$/),
        price: Joi.string().pattern(/^\d+$/),
        category_id: Joi.number().integer().positive()
    }),
    lessonSchema: Joi.object({
        name: Joi.string().min(3).max(30).required(),
        description: Joi.string().max(500).required(),
        section_id: Joi.number().integer().positive().required()
    }),
    updateLessonSchema: Joi.object({
        name: Joi.string().min(3).max(30),
        description: Joi.string().max(500),
        section_id: Joi.number().integer().positive()
    }),
    teacherSchema: Joi.object({
        fullname: Joi.string().min(3).max(30).required(),
        phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/).required(),
        password: Joi.string().min(6).required(),
    }),
    teacherUpdateSchema: Joi.object({
        fullname: Joi.string().min(3).max(30),
        phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/),
        password: Joi.string().min(6)
    }),
    assistSchema: Joi.object({
        fullname: Joi.string().min(3).max(30).required(),
        phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/).required(),
        password: Joi.string().min(6).required(),
        course_id: Joi.number().integer().positive().required()
    }),
    assistUpdateSchema: Joi.object({
        fullname: Joi.string().min(3).max(30),
        phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/),
        password: Joi.string().min(6),
        course_id: Joi.number().integer().positive()
    }),
    taskSchema: Joi.object({
        description: Joi.string().max(500).required(),
        lesson_id: Joi.number().integer().positive().required()
    }),
    updateTaskSchema: Joi.object({
        description: Joi.string().max(500),
        lesson_id: Joi.number().integer().positive()
    }),
    materialSchema: Joi.object({
        lesson_id: Joi.number().integer().positive().required()
    }),
    updateMaterialSchema: Joi.object({
        lesson_id: Joi.number().integer().positive()
    }),
    sectionSchema: Joi.object({
        name: Joi.string().min(3).max(30).required(),
        course_id: Joi.number().integer().positive().required()
    }),
    updateSectionSchema: Joi.object({
        name: Joi.string().min(3).max(30),
        course_id: Joi.number().integer().positive()
    }),
    examSchema: Joi.object({
        lesson_id: Joi.number().integer().positive().required(),
        question: Joi.string().max(500).required(),
        variantA: Joi.string().max(500).required(),
        variantB: Joi.string().max(500).required(),
        variantC: Joi.string().max(500).required(),
        variantD: Joi.string().max(500).required(),
        answer: Joi.string().max(500).required()
    }),
    updateExamSchema: Joi.object({
        lesson_id: Joi.number().integer().positive(),
        question: Joi.string().max(500),
        variantA: Joi.string().max(500),
        variantB: Joi.string().max(500),
        variantC: Joi.string().max(500),
        variantD: Joi.string().max(500),
        answer: Joi.string().max(500)
    })
}