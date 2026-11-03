import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

class SectionService {
    async getAllSections(req, res, next) {
        try {
            const sections = await pool.query(`select id, name from sections where status ='active'`)
            return {
                status: 200,
                data: sections.rows
            }
        } catch (error) {
            next(new ErrorException(500, "Internal server error!"))
        }
    }

    async createSection(req, res, next) {
        try {
            const { name, course_id } = req.body

            let existName = await pool.query(`select * from sections where name = $1`, [name])
            if (existName.rows.length) {
                return next(new ErrorException(409, "Section already exist with this name"))
            }

            const existCourse = await pool.query(`select * from courses where id = $1`, [course_id])
            if (!existCourse.rows.length) {
                return next(new ErrorException(404, "Course not found!"))
            }

            if(existCourse.rows[0].teacher_id != req.user.id) {
                return next(new ErrorException(403, "You cannot add section to this course!"))
            }

            if (existCourse.rows[0].status !== "active") {
                return next(new ErrorException(400, "Course is not active!"))
            }

            await pool.query(`insert into sections(name, course_id) 
                values($1, $2)`, [name, course_id])

            return {
                status: 201,
                message: "Section added!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async updateSection(req, res, next) {
        try {
            const { name } = req.body || []
            const { userId } = req.params
            let existSection = await pool.query(`select * from sections where id = $1`, [userId])
            if (!existSection.rows.length) {
                return next(new ErrorException(404, "Section not found!"))
            }

            let currentSection = existSection.rows[0]

            if(name && name !== currentSection.name) {
                let existName = await pool.query(`select * from sections where name = $1 and id != $2`, [name, userId])
                if(existName.rows.length) {
                    return next(new ErrorException(409, "Section already exist with this name"))
                }
            }

            await pool.query(`update sections set name = $1 where id = $2`, [name, userId])
            return {
                status: 200,
                message: "Section updated!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async deleteSection(req, res, next) {
        try {
            const { userId } = req.params
            let existSection = await pool.query(`select * from sections where id = $1`, [userId])
            if (!existSection.rows.length) {
                return next(new ErrorException(404, "Section not found!"))
            }
            await pool.query(`update sections set status = 'inactive' where id = $1`, [userId])

            return {
                status: 200,
                message: "Section deleted!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
}

const sectionService = new SectionService()

export default sectionService