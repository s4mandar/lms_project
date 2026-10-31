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

            const fileNameBanner = Date.now() + "." + banner.mimetype.split("/")[1]
            banner.mv(process.cwd() + "/src/uploads/banners/" + fileNameBanner, (error) => {
                if(error) {
                    return next(new ErrorException(500, error))
                }
            })

            const fileNameIntroVideo = Date.now() + "." + introVideo.mimetype.split("/")[1]
            introVideo.mv(process.cwd() + "/src/uploads/introvideos/" + fileNameIntroVideo, (error) => {
                if(error) {
                    return next(new ErrorException(500, error))
                }
            })

            await pool.query(`insert into courses(banner, intro_video, name, description, level, price, category_id) 
                values($1, $2, $3, $4, $5, $6, $7)`, [fileNameBanner, fileNameIntroVideo ,name, description,level, price, category_id])

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