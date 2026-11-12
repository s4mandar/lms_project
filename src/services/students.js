import pool from "../config/db.js"
import argon from "argon2"
import { ErrorException } from "../utils/error.js"

class StudentService {

    async getAllStudents(req, res, next) {
        try {
            const students = await pool.query(`select id, fullname, phone, photo,status, created_at from students`)

            return {
                status: 200,
                data: students.rows
            }
        } catch (error) {
            next(new ErrorException(500, "Internal server error!"))
        }
    }

    async getMyAllCourses(req, res, next) {
        try {
            let studentId = req.user.id

            const course = await pool.query(`
                select c.id, c.name, c.banner, t.fullname, t.photo from studentcourse 
                sc inner join courses c on sc.course_id = c.id 
                inner join teachers t on c.teacher_id = t.id where sc.student_id = $1`, [studentId])

            return {
                status: 200,
                data: course.rows
            }

        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async createStudent(req, res, next) {
        try {
            const { fullname, phone, password, course_id } = req.body
            let existStudent = await pool.query(`select * from students where phone = $1`, [phone])
            if (existStudent.rows.length) {
                return next(new ErrorException(409, "Student already exist with this phone"))
            }

            let existCourseId = await pool.query(`select * from courses where id =$1`, [course_id])

            if (!existCourseId.rows.length) {
                return next(new ErrorException(404, "Course not found with this course Id"))
            }
            let hashPass = await argon.hash(password)

            let student = await pool.query(`insert into students(fullname, phone, password) 
                values($1, $2, $3) returning id `, [fullname, phone, hashPass])

            let studentId = student.rows[0].id

            await pool.query(`insert into studentcourse(student_id, course_id) values($1, $2)`, [studentId, course_id])

            return {
                status: 201,
                message: "Student added and course purchased!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async updateStudentbyId(req, res, next) {
        try {
            let { userId } = req.params
            let { fullname, phone, password } = req.body || {}
            let { photo } = req.files || {}

            let existStudent = await pool.query(`select * from students where id = $1`, [userId])
            if (!existStudent.rows.length) {
                return next(new ErrorException(404, "Student not found with this userId"))
            }

            let currentStudent = existStudent.rows[0]

            if (phone && phone !== currentStudent.phone) {
                const existPhone = await pool.query(`select id from students where phone = $1 and id != $2`, [phone, userId])
                if (existPhone.rows.length) {
                    return next(new ErrorException(409, "Student already exist with this phone"))
                }
            }

            let updatePassword = currentStudent.password

            if (password) {
                updatePassword = await argon.hash(password)
            }

            let photoName = null

            if (photo) {
                photoName = Date.now() + "." + photo.mimetype.split("/")[1]

                const allowFileType = ["png", "jpg", "jpeg", "svg"]

                if (!allowFileType.includes(photo.mimetype.split("/")[1])) {
                    return next(new ErrorException(415, "Unsupported mediatype"))
                }
                photo.mv(process.cwd() + "/src/uploads/students_fotos/" + photoName, (error) => {
                    if (error) {
                        return next(new ErrorException(500, error))
                    }
                })
            }

            let updateFullName = fullname ? fullname : currentStudent.fullname
            let updatePhone = phone ? phone : currentStudent.phone
            let updatePhoto = photo ? photoName : currentStudent.photo

            await pool.query(`update students set fullname=$1, phone=$2, photo=$3, password=$4 where id = $5`,
                [updateFullName, updatePhone, updatePhoto, updatePassword, userId])

            return {
                status: 201,
                message: "Student updated successfully!"
            }

        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async deleteStudent(req, res, next) {
        try {
            const { userId } = req.params
            let existStudent = await pool.query(`select * from students where id = $1`, [userId])
            if (!existStudent.rows.length) {
                return next(new ErrorException(404, "Student not found with this userId"))
            }
            await pool.query(`update students set status = 'inactive' where id = $1`, [userId])

            return {
                status: 200,
                message: "Student deleted!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
}

const studentService = new StudentService()

export default studentService