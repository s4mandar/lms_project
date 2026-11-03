import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

class CoursesService {

    async getAllCourses(req, res, next) {
        try {
            const courses = await pool.query(`select * from courses`)
            return {
                status: 200,
                data: courses.rows
            }
        } catch (error) {
            next(new ErrorException(500, "Internal server error!"))
        }
    }


    async createCourse(req, res, next) {
        try {
            const { name, description, price, category_id, level } = req.body
            const { banner, introVideo } = req.files
            const teacher_id = req.user.id

            const existCourse = await pool.query(`select * from courses where name = $1`,  [name])
            if(existCourse.rows.length) {
                return next(new ErrorException(409, "Course already exists!"))
            }

            if(!banner) {
                return next(new ErrorException(400, "Banner is required!"))
            }

            const fileNameBanner = Date.now() + "." + banner.mimetype.split("/")[1]   
            const allowFileType = ["png", "jpg", "jpeg", "svg"]

            if(!allowFileType.includes(banner.mimetype.split("/")[1])) {
                return next(new ErrorException(415, "Unsupported mediatype"))
            }
            banner.mv(process.cwd() + "/src/uploads/banners/" + fileNameBanner, (error) => {
                if (error) {
                    return next(new ErrorException(500, error))
                }
            })

            let fileNameIntroVideo = null
            if(fileNameIntroVideo) {
                const fileNameIntroVideo = Date.now() + "." + introVideo.mimetype.split("/")[1]
            introVideo.mv(process.cwd() + "/src/uploads/introvideos/" + fileNameIntroVideo, (error) => {
                if (error) {
                    return next(new ErrorException(500, error))
                }
            })
            }

            await pool.query(`insert into courses(banner, intro_video, name, description, level, price, category_id, teacher_id) 
                values($1, $2, $3, $4, $5, $6, $7, $8)`, [fileNameBanner, fileNameIntroVideo, name, description, level, price, category_id, teacher_id])

            return {
                status: 201,
                message: "Course added!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
}

const coursesService = new CoursesService()

export default coursesService