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


    async createStudent(req, res, next) {
        try {
            const { fullname, phone, password } = req.body
            let existStudent = await pool.query(`select * from students where phone = $1`, [phone])
            if (existStudent.rows.length) {
                return next(new ErrorException(409, "Student already exist with this phone"))
            }
            let hashPass = await argon.hash(password)

            await pool.query(`insert into students(fullname, phone, password) 
                values($1, $2, $3)`, [fullname, phone, hashPass])

            return {
                status: 201,
                message: "Student added!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
}

const studentService = new StudentService()

export default studentService