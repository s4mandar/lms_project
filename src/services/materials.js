import { ErrorException } from "../utils/error.js"
import pool from "../config/db.js"

class MaterialsService {
    constructor() { }

    async getMaterialByLessonId(req, res, next) {
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
                return next(new ErrorException(403, "You cannot get materials"))
            }

            const materials = await pool.query(`select * from materials where lesson_id = $1`, [lessonId])
            return {
                status: 200,
                data: materials.rows
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async getAllMaterials(req, res, next) {
        try {
            const materials = await pool.query(`select * from materials`)
            return {
                status: 200,
                data: materials.rows
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async createMaterial(req, res, next) {
        try {
            let { lesson_id, description } = req.body
            let { file } = req.files

            let fileName = Date.now() + "." + file.mimetype.split("/")[1]
            let allowFileType = ["pdf", "docx", "pptx", "txt", "jpg", "jpeg", "png", "gif"]

            if (!allowFileType.includes(file.mimetype.split("/")[1])) {
                return next(new ErrorException(400, "Invalid file type!"))
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
                return next(new ErrorException(403, "You are not authorized to add material to this lesson!"))
            }

            await pool.query(`insert into materials(lesson_id, description, file) values($1, $2, $3)`,
                [lesson_id, description, fileName])

            file.mv(process.cwd() + "/src/uploads/materials/" + fileName, (error) => {
                if (error) {
                    return next(new ErrorException(500, error))
                }
            })

            return {
                status: 201,
                message: "Material created successfully!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async updateMaterial(req, res, next) {
        try {
            let { id } = req.params
            let { lesson_id, description } = req.body || {}
            let { file } = req.files || {}

            let existMaterial = await pool.query(`select * from materials where id = $1`, [id])
            if (!existMaterial.rows.length) {
                return next(new ErrorException(404, "Material not found with this id!"))
            }

            let currentMaterial = existMaterial.rows[0]

            if (lesson_id) {
                let existLesson = await pool.query(`select * from lessons where id=$1`, [lesson_id])
                if (!existLesson.rows.length) {
                    return next(new ErrorException(404, "Lesson not found!"))
                }
            }

            let FileName = currentMaterial.file

            if (file) {
                FileName = Date.now() + "." + file.mimetype.split("/")[1]

                const allowFileType = ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt", "jpg", "jpeg", "png", "gif"]

                if (!allowFileType.includes(file.mimetype.split("/")[1])) {
                    return next(new ErrorException(415, "Unsupported mediatype"))
                }

                await file.mv(process.cwd() + "/src/uploads/materials/" + FileName)
            }

            let updateLessonId = lesson_id ? lesson_id : currentMaterial.lesson_id
            let updateDescription = description ? description : currentMaterial.description
            let updateFileName = FileName

            await pool.query(`update materials set lesson_id=$1, description=$2, file=$3 where id=$4`,
                [updateLessonId, updateDescription, updateFileName, id]
            )

            return {
                status: 200,
                message: "Material successfully updated!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async deleteMaterial(req, res, next) {
        let { id } = req.params

        let existMaterial = await pool.query(`select * from materials where id = $1`, [id])
        if(!existMaterial.rows.length) {
            return next(new ErrorException(404, "Material not found!"))
        }

        await pool.query(`delete from materials where id = $1`, [id])

        return {
            status: 200,
            message: "Material deleted!"
        }
    }
}

let materialService = new MaterialsService()

export default materialService