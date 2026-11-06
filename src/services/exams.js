import { ErrorException } from "../utils/error.js"
import pool from "../config/db.js"

class ExamService {
    constructor() { }

    async getExamByLessonId(req, res, next) {
        try {
            const { lessonId } = req.params

            let existLesson = await pool.query(`select * from lessons where id=$1`, [lessonId])

            if (!existLesson.rows.length) {
                return next(new ErrorException(404, "Lesson not found!"))
            }

            const sectionId = existLesson.rows[0].section_id
            if (!sectionId) {
                return next(new ErrorException(400, "Lesson does not belong to any section!"))
            }

            const sections = await pool.query(`select * from sections where id=$1`, [sectionId])
            if (!sections.rows.length) {
                return next(new ErrorException(404, "Section not found!"))
            }

            let course = await pool.query(`select * from courses where id = $1`, [sections.rows[0].course_id])
            if (!course.rows.length) {
                return next(new ErrorException(404, "Course not found"))
            }

            if (req.user.role == "teacher" && course.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "You cannot get task"))
            }

            const exams = await pool.query(`select * from exams where lesson_id = $1`, [lessonId])
            return {
                status: 200,
                data: exams.rows
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async getAllExams(req, res, next) {
        try {
            const exams = await pool.query(`select * from exams`)
            return {
                status: 200,
                data: exams.rows
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async createExam(req, res, next) {
        try {
            let { lesson_id, question, variantA, variantB, variantC, variantD, answer } = req.body || {}

            answer = answer?.toLowerCase()

            const allowedAnswers = ["varianta", "variantb", "variantc", "variantd"]

            if (!allowedAnswers.includes(answer)) {
                return next(new ErrorException(400, "Invalid answer! Answer must be varianta, variantb, variantc or variantd"))
            }

            let existLesson = await pool.query(`select * from lessons where id=$1`, [lesson_id])
            if (!existLesson.rows.length) {
                return next(new ErrorException(404, "Lesson not found!"))
            }

            let sectionId = existLesson.rows[0].section_id
            if (!sectionId) {
                return next(new ErrorException(404, "Section not found!"))
            }

            let courseId = await pool.query(`select course_id from sections where id=$1`, [sectionId])

            if (!courseId.rows.length) {
                return next(new ErrorException(404, "Course not found!"))
            }

            let teacher = await pool.query(`select teacher_id from courses where id=$1`, [courseId.rows[0].course_id])

            if (req.user.role === "teacher" && teacher.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "You are not authorized to add task!"))
            }

            await pool.query(`insert into exams(lesson_id, question, variantA, variantB, variantC, variantD, answer ) values($1, $2, $3, $4, $5, $6, $7)`,
                [lesson_id, question, variantA, variantB, variantC, variantD, answer])

            return {
                status: 201,
                message: "Exam created successfully!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async updateExam(req, res, next) {
        try {
            let { examId } = req.params
            let { lesson_id, question, variantA, variantB, variantC, variantD, answer } = req.body || {}

            let existExam = await pool.query(`select * from exams where id = $1`, [examId])
            if (!existExam.rows.length) {
                return next(new ErrorException(404, "Exam not found with this id!"))
            }

            let currentExam = existExam.rows[0]

            if (lesson_id) {
                let existLesson = await pool.query(`select * from lessons where id=$1`, [lesson_id])
                if (!existLesson.rows.length) {
                    return next(new ErrorException(404, "Lesson not found!"))
                }
            }

            let updateLessonId = lesson_id ?? currentExam.lesson_id
            let updateQuestion = question ?? currentExam.question
            let updateVariantA = variantA ?? currentExam.varianta
            let updateVariantB = variantB ?? currentExam.variantb
            let updateVariantC = variantC ?? currentExam.variantc
            let updateVariantD = variantD ?? currentExam.variantd
            let updateAnswer = answer ?? currentExam.answer

            await pool.query(`update exams set lesson_id=$1, question=$2, varianta=$3, variantb=$4, variantc=$5, variantd=$6, answer=$7 where id=$8`,
                [updateLessonId, updateQuestion, updateVariantA, updateVariantB, updateVariantC, updateVariantD, updateAnswer, examId]
            )

            return {
                status: 200,
                message: "Exam successfully updated!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async deleteExam(req, res, next) {
        let { examId } = req.params

        let existExam = await pool.query(`select * from exams where id = $1`, [examId])
        if (!existExam.rows.length) {
            return next(new ErrorException(404, "Exam not found!"))
        }

        await pool.query(`delete from exams where id = $1`, [examId])

        return {
            status: 200,
            message: "Exam deleted!"
        }
    }
}

let examService = new ExamService()

export default examService