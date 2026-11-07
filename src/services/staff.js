import pool from "../config/db.js"
import argon2 from "argon2"
import { ErrorException } from "../utils/error.js"

class StaffService {
    constructor() { }

    async getStaffs(req, res, next) {
        try {
            const staffs = await pool.query(`select id, fullname, phone, photo, role, status, created_at  from staff`)
            return {
                status: 200,
                data: staffs.rows
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async createStaff(req, res, next) {
        try {
            const { fullname, phone, password, role } = req.body
            let existStaff = await pool.query(`select * from staff where phone = $1`, [phone])
            if (existStaff.rows.length) {
                return next(new ErrorException(409, "User already exist with this phone"))
            }
            let hashPassword = await argon2.hash(password)
            await pool.query(`insert into staff(fullname, phone, password, role)
                values($1, $2, $3, $4)`, [fullname, phone, hashPassword, role])

            return {
                status: 201,
                message: "User successfully created"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async updateStaff(req, res, next) {
        try {
            let { userId } = req.params
            let { fullname, phone, password, role } = req.body || {}
            let { photo } = req.files || {}

            let existStaff = await pool.query(`select * from staff where id = $1`, [userId])
            if (!existStaff.rows.length) {
                return next(new ErrorException(404, "User not found with this userId"))
            }

            let currentStaff = existStaff.rows[0]

            let updatePassword = currentStaff.password

            if (password) {
                updatePassword = await argon2.hash(password)
            }

            let photoName = currentStaff.photo

            if (photo) {
                let photoName = Date.now() + "." + photo.mimetype.split("/")[1]

                const allowFileType = ["png", "jpg", "jpeg", "svg"]

                if (!allowFileType.includes(photo.mimetype.split("/")[1])) {
                    return next(new ErrorException(415, "Unsupported mediatype"))
                }
                photo.mv(process.cwd() + "/src/uploads/staff_fotos/" + photoName, (error) => {
                    if (error) {
                        return next(new ErrorException(500, error))
                    }
                })
            }

            let updateFullName = fullname ? fullname : currentStaff.fullname
            let updatePhone = phone !== undefined ? phone : currentStaff.phone
            let updatePhoto = photoName
            let updateRole = role ? role : currentStaff.role

            await pool.query(`update staff set fullname=$1, phone=$2, photo=$3, password=$4, role=$5 where id = $6`,
                [updateFullName, updatePhone, updatePhoto, updatePassword, updateRole, userId])

            return {
                status: 201,
                message: "Staff updated successfully!"
            }

        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async deleteStaff(req, res, next) {
        try {
            const { userId } = req.params
            let existStaff = await pool.query(`select * from staff where id = $1`, [userId])
            if (!existStaff.rows.length) {
                return next(new ErrorException(404, "User not found with this userId"))
            }
            await pool.query(`update staff set status = 'inactive' where id = $1`, [userId])

            return {
                status: 200,
                message: "User deleted!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
}

let staffservice = new StaffService()

export default staffservice