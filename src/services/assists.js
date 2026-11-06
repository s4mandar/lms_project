import pool from "../config/db.js"
import argon from "argon2"
import { ErrorException } from "../utils/error.js"

class AssistService {

    async getAllAssists(req, res, next) {
        try {
            const assists = await pool.query(`select id, course_id, photo, fullname, phone, created_at, status from assists`)

            return {
                status: 200,
                data: assists.rows
            }
        } catch (error) {
            next(new ErrorException(500, "Internal server error!"))
        }
    }

    async getAssistByAssistId(req, res, next) {
        try {
            let { assistId } = req.params

            let assist = await pool.query(`select id, course_id, phone, fullname, photo, created_at, status from assists where id = $1`, [assistId])

            if (!assist.rows.length) {
                return next(new ErrorException(404, "Assistant not found with this id!"))
            }

            return {
                status: 200,
                data: assist.rows
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async createAssist(req, res, next) {
        try {
            const { fullname, phone, password, course_id } = req.body

            let existCourse = await pool.query(`select * from courses where id = $1`, [course_id])

            if (!existCourse.rows.length) {
                return next(new ErrorException(409, "CourseId not found"))
            }

            let existNumber = await pool.query(`select * from assists where phone = $1`, [phone])

            if (existNumber.rows.length) {
                return next(new ErrorException(409, "Assist Number already exist!"))
            }

            let hashPass = await argon.hash(password)

            await pool.query(`insert into assists(fullname, phone, password, course_id) 
                values($1, $2, $3, $4)`, [fullname, phone, hashPass, course_id])

            return {
                status: 201,
                message: "Assistant added!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async updateAssistById(req, res, next) {
        try {
            let { assistId } = req.params
            let { fullname, phone, password, course_id } = req.body || {}
            let { photo } = req.files || {}

            let existAssist = await pool.query(`select * from assists where id = $1`, [assistId])
            if (!existAssist.rows.length) {
                return next(new ErrorException(404, "Assistant not found with this id"))
            }

            let currentAsistant = existAssist.rows[0]

            let updatePassword = currentAsistant.password

            if (password) {
                updatePassword = await argon.hash(password)
            }

            if (course_id) {
                let existCourse = await pool.query(`select * from courses where id = $1`, [course_id])
                if (!existCourse.rows.length) {
                    return next(new ErrorException(409, "CourseId not found to update"))
                }
            }


            let photoName = currentAsistant.photo

            if (photo) {
                photoName = Date.now() + "." + photo.mimetype.split("/")[1]

                const allowFileType = ["png", "jpg", "jpeg", "svg"]

                if (!allowFileType.includes(photo.mimetype.split("/")[1])) {
                    return next(new ErrorException(415, "Unsupported mediatype"))
                }
                await photo.mv(process.cwd() + "/src/uploads/assistants_fotos/" + photoName)
            }

            let updateFullName = fullname ? fullname : currentAsistant.fullname
            let updatePhone = phone ? phone : currentAsistant.phone
            let updatePhoto = photoName
            let updateCourseId = course_id ? course_id : currentAsistant.course_id

            await pool.query(`update assists set fullname=$1, phone=$2, password=$3, photo=$4, course_id=$5 where id = $6`,
                [updateFullName, updatePhone, updatePassword, updatePhoto, updateCourseId, assistId])

            return {
                status: 200,
                message: "Assistant updated successfully!"
            }

        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
    
    async deleteAssist(req, res, next) {
        try {
            let { assistId } = req.params

            let existAssist = await pool.query(`select * from assists where id = $1`, [assistId])
            if (!existAssist.rows.length) {
                return next(new ErrorException(404, "Assistant not found with this id"))
            }
            await pool.query(`update assists set status = 'inactive' where id = $1`, [assistId])

            return {
                status: 200,
                message: "Assistant deleted successfully!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
}

const assistService = new AssistService()

export default assistService