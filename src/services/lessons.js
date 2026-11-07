import { ErrorException } from "../utils/error.js"
import pool from "../config/db.js"

class LessonService {
    constructor() { }

    async getLessonsBySectionId(req, res, next) {
        try {
            const { sectionId } = req.params

            let existSection = await pool.query(`select * from sections where id=$1`, [sectionId])

            if (!existSection.rows.length) {
                return next(new ErrorException(404, "Section not found!"))
            }

            let course = await pool.query(`select * from courses where id = $1`, [existSection.rows[0].course_id])
            if (!course.rows.length) {
                return next(new ErrorException(404, "Course not found"))
            }

            if (req.user.role == "teacher" && course.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "Error qandaydr"))
            }

            const lessons = await pool.query(`select * from lessons where section_id = $1`, [sectionId])
            return {
                status: 200,
                data: lessons.rows
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async getAllLessons(req, res, next) {
        try {
            const lessons = await pool.query(`select * from lessons`)
            return {
                status: 200,
                data: lessons.rows
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async createLesson(req, res, next) {
        try {
            let { name, section_id, description } = req.body
            let { file } = req.files || {}

            if (!file) {
                return next(new ErrorException(400, "Lesson file is required!"))
            }

            let fileName = Date.now() + "." + file.mimetype.split("/")[1]
            let allowFileType = ["mp4", "mov", "webm", "avi", "ogm"]

            if (!allowFileType.includes(file.mimetype.split("/")[1])) {
                return next(new ErrorException(415, "Unsupported Mediatype"))
            }

            let exitsName = await pool.query(`select * from lessons where name = $1`, [name])
            if (exitsName.rows.length) {
                return next(new ErrorException(409, "Lesson already exist!"))
            }

            let existSection = await pool.query(`select * from sections where id = $1`, [section_id])
            if (!existSection.rows.length) {
                return next(new ErrorException(404, "Section not found!"))
            }
            let courseId = existSection.rows[0].course_id

            let teacher = await pool.query(`select teacher_id from courses where id = $1`, [courseId])

            if (!teacher.rows.length) {
                return next(new ErrorException(404, "Course not found!"))
            }

            if (teacher.rows[0].teacher_id != req.user.id) {
                return next(new ErrorException(403, "You cant add lesson to this section!"))
            }

            if (existSection.rows[0].status != "active") {
                return next(new ErrorException(400, "Section is not active!"))
            }

            await file.mv(process.cwd() + "/src/uploads/lessons_file/" + fileName, (error) => {
                if (error) {
                    return next(new ErrorException(500, error))
                }
            })

            await pool.query(`insert into lessons(section_id, name, description, file) values($1, $2, $3, $4)`,
                [section_id, name, description, fileName])

            return {
                status: 201,
                message: "Lesson added!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async updateLesson(req, res, next) {
        try {
            let { id } = req.params
            let { section_id, name, description } = req.body || {}
            let { file } = req.files || {}

            let existLesson = await pool.query(`select * from lessons where id = $1`, [id])
            if (!existLesson.rows.length) {
                return next(new ErrorException(404, "Lesson not found with this id"))
            }

            let currentLesson = existLesson.rows[0]

            let teacher = await pool.query(`select c.teacher_id from sections s join courses c on c.id = s.course_id where s.id = $1`,
                [currentLesson.section_id])

            if (req.user.role === "teacher" && teacher.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "You cannot update this lesson!"))
            }

            if (section_id) {
                let existSection = await pool.query(`select * from sections where id = $1`, [section_id])
                if (!existSection.rows.length) {
                    return next(new ErrorException(409, "SectionId not found to update"))
                }
            }

            let teach = await pool.query(`select c.teacher_id from sections s join courses c on c.id = s.course_id where s.id = $1`,
                [section_id])

            if (req.user.role === "teacher" && teach.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "You cannot move lesson to this section!"))
            }

            let FileName = currentLesson.file

            if (file) {
                FileName = Date.now() + "." + file.mimetype.split("/")[1]

                const allowFileType = ["mp4", "mov", "webm", "avi", "ogm"]

                if (!allowFileType.includes(file.mimetype.split("/")[1])) {
                    return next(new ErrorException(415, "Unsupported mediatype"))
                }
                await file.mv(process.cwd() + "/src/uploads/lessons_file/" + FileName)
            }

            let updateSectionId = section_id ? section_id : currentLesson.section_id
            let updateName = name ? name : currentLesson.name
            let descriptionUpdate = description ? description : currentLesson.description
            let updateFileName = FileName

            await pool.query(`update lessons set section_id=$1, name=$2, description=$3, file=$4 where id=$5`,
                [updateSectionId, updateName, descriptionUpdate, updateFileName, id])

            return {
                status: 200,
                message: "Lesson successfully updated!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async deleteLesson(req, res, next) {
        try {
            let { id } = req.params

            let existLesson = await pool.query(`select * from lessons where id = $1`, [id])
            if (!existLesson.rows.length) {
                return next(new ErrorException(404, "Lesson not found with this id"))
            }

            let teacher = await pool.query(`select c.teacher_id from sections s join courses c on c.id = s.course_id where s.id = $1`,
                [existLesson.rows[0].section_id])

            if (req.user.role === "teacher" && teacher.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "You cannot delete this lesson!"))
            }

            await pool.query(`update lessons set status = 'inactive' where id = $1`, [id])

            return {
                status: 200,
                message: "Lesson successfully deleted!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
}

let lessonService = new LessonService()

export default lessonService