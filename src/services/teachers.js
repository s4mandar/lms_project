import pool from "../config/db.js"
import argon from "argon2"
import { ErrorException } from "../utils/error.js"

class TeacherService {

    async getAllTeachers(req, res, next) {
        try {
            const teachers = await pool.query(`select id, fullname, phone, created_at, status from teachers`)

            return {
                status: 200,
                data: teachers.rows
            }
        } catch (error) {
            next(new ErrorException(500, "Internal server error!"))
        }
    }


    async createTeacher(req, res, next) {
        try {
            const { fullname, phone, password, experience, job, description, portfolio, github, telegram, linkedin } = req.body
            let hashPass = await argon.hash(password)

            await pool.query(`insert into teachers(fullname, phone, password, experience, job, description, portfolio, github, telegram, linkedin) 
                values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [fullname, phone, hashPass, experience, job, description, portfolio, github, telegram, linkedin])

            return {    
                status: 201,
                message: "Teacher added!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async updateTeacherbyId(req, res, next) {
    try {
        let { userId } = req.params
        let { fullname, phone, password, experience, job, description, portfolio, github, telegram, linkedin } = req.body || []
        let { photo } = req.files || {}

        let existTeacher = await pool.query(`select * from teachers where id = $1`, [userId])
        if (!existTeacher.rows.length) {
            return next(new ErrorException(404, "Teacher not found with this userId"))
        }

        let currentTeacher = existTeacher.rows[0]

        let updatePassword = currentTeacher.password

        if (password) {
            updatePassword = await argon.hash(password)
        }

        let photoName = currentTeacher.photo

        if (photo) {
            photoName = Date.now() + "." + photo.mimetype.split("/")[1]

            const allowFileType = ["png", "jpg", "jpeg", "svg"]

            if (!allowFileType.includes(photo.mimetype.split("/")[1])) {
                return next(new ErrorException(415, "Unsupported mediatype"))
            }
            await photo.mv(process.cwd() + "/src/uploads/teachers_fotos/" + photoName)
        }

        let updateFullName = fullname ? fullname : currentTeacher.fullname
        let updatePhone = phone ? phone : currentTeacher.phone
        let updatePhoto = photoName
        let updateExperience = experience ? experience : currentTeacher.experience
        let updateJob = job ? job : currentTeacher.job
        let updateDescription = description ? description : currentTeacher.description
        let updatePortfolio = portfolio ? portfolio : currentTeacher.portfolio
        let updateGithub = github ? github : currentTeacher.github
        let updateTelegram = telegram ? telegram : currentTeacher.telegram
        let updateLinkedin = linkedin ? linkedin : currentTeacher.linkedin

        await pool.query(`update teachers set fullname=$1, phone=$2, password=$3, experience=$4, job=$5, description=$6, portfolio=$7, github=$8, telegram=$9, linkedin=$10, photo=$11 where id = $12`,
            [updateFullName, updatePhone, updatePassword, updateExperience, updateJob, updateDescription, updatePortfolio, updateGithub, updateTelegram, updateLinkedin, updatePhoto, userId])

        return {
            status: 200,
            message: "Teacher updated successfully!"
        }

    } catch (error) {
        return next(new ErrorException(500, error))
    }
}
    async deleteTeacher(req, res, next) {
        try {
            let { userId } = req.params
            let existTeacher = await pool.query(`select * from teachers where id = $1`, [userId])
            if (!existTeacher.rows.length) {
                return next(new ErrorException(404, "Teacher not found with this userId"))
            }
            await pool.query(`update teachers set status = 'inactive' where id = $1`, [userId])

            return {
                status: 200,
                message: "Teacher deleted successfully!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
}

const teacherService = new TeacherService()

export default teacherService