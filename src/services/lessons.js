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
            let lessons

            if (req.user.role === "admin") {
                lessons = await pool.query(`select * from lessons where status = 'active'`)
            } else {
                lessons = await pool.query(`select l.* from lessons l join sections s on s.id = l.section_id join courses c on c.id = s.course_id where c.teacher_id = $1 and l.status = 'active'`,
                    [req.user.id])
            }

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

            let exitsName = await pool.query(
                `select id from lessons where section_id = $1 and lower(name) = lower($2) and status = 'active'`,
                [section_id, name])

            if (exitsName.rows.length) {
                return next(new ErrorException(409, "Lesson already exists in this section!"))
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

            if (!teacher.rows.length) {
                return next(new ErrorException(404, "Course or section not found!"))
            }

            if (req.user.role === "teacher" && teacher.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "You cannot update this lesson!"))
            }

            if (section_id && section_id != currentLesson.section_id) {
                let existSection = await pool.query(`select * from sections where id = $1`,
                    [section_id])

                if (!existSection.rows.length) {
                    return next(new ErrorException(404, "Section not found!"))
                }

                if (existSection.rows[0].status !== "active") {
                    return next(new ErrorException(400, "Section is not active!"))
                }

                let teach = await pool.query(`select c.teacher_id from sections s join courses c on c.id = s.course_id where s.id = $1`,
                    [section_id])

                if (!teach.rows.length) {
                    return next(new ErrorException(404, "Course not found!"))
                }

                if (req.user.role === "teacher" && teach.rows[0].teacher_id !== req.user.id) {
                    return next(new ErrorException(403, "You cannot move lesson to this section!"))
                }
            }

            let updateSectionId = section_id ? section_id : currentLesson.section_id
            let updateName = name ? name : currentLesson.name

            if (name || section_id) {
                let existName = await pool.query(
                    `select id from lessons where section_id = $1 and lower(name) = lower($2) and status = 'active' and id != $3`,
                    [updateSectionId, updateName, id])

                if (existName.rows.length) {
                    return next(new ErrorException(409, "Lesson already exists in this section!"))
                }
            }
            let FileName = currentLesson.file

            if (file) {
                let fileType = file.mimetype.split("/")[1]

                const allowFileType = ["mp4", "mov", "webm", "avi", "ogm"]

                if (!allowFileType.includes(fileType)) {
                    return next(new ErrorException(415, "Unsupported mediatype"))
                }

                FileName = Date.now() + "." + fileType

                await file.mv(
                    process.cwd() + "/src/uploads/lessons_file/" + FileName
                )
            }

            let descriptionUpdate = description !== undefined
                ? description
                : currentLesson.description

            await pool.query(`update lessons set section_id = $1, name = $2, description = $3, file = $4 where id = $5`,
                [updateSectionId, updateName, descriptionUpdate, FileName, id])

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