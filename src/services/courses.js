import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

class CoursesService {

    async getMyCourses(req, res, next) {
        try {
            let courses = await pool.query(`select * from courses where teacher_id = $1`, [req.user.id])

            return {
                status: 200,
                data: courses.rows
            }
        } catch (error) {
            next(new ErrorException(500, error))
        }
    }

    async getAllCourses(req, res, next) {
        try {
            const courses = await pool.query(`select * from courses where purchased = true`)
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
            const { banner, introVideo } = req.files || {}
            const teacher_id = req.user.id

            const existCourse = await pool.query(`select * from courses where name = $1`, [name])
            if (existCourse.rows.length) {
                return next(new ErrorException(409, "Course already exists!"))
            }

            if (!banner) {
                return next(new ErrorException(400, "Banner is required!"))
            }

            const fileNameBanner = Date.now() + "." + banner.mimetype.split("/")[1]
            const allowFileType = ["png", "jpg", "jpeg", "svg"]

            if (!allowFileType.includes(banner.mimetype.split("/")[1])) {
                return next(new ErrorException(415, "Unsupported mediatype"))
            }
            await banner.mv(process.cwd() + "/src/uploads/banners/" + fileNameBanner, (error) => {
                if (error) {
                    return next(new ErrorException(500, error))
                }
            })

            let fileNameIntroVideo = null

            if (introVideo) {
                fileNameIntroVideo = Date.now() + "." + introVideo.mimetype.split("/")[1]

                const allowFileType = [
                    "mp4", "mpeg", "mov", "avi", "mkv",
                    "webm", "ogv", "3gp", "wmv", "flv"
                ]

                if (!allowFileType.includes(introVideo.mimetype.split("/")[1])) {
                    return next(new ErrorException(415, "Unsupported mediatype"))
                }

                await introVideo.mv(
                    process.cwd() + "/src/uploads/introvideos/" + fileNameIntroVideo
                )
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

    async updateCourse(req, res, next) {
        try {
            let { id } = req.params
            let { name, description, level, price, category_id } = req.body || {}
            let { banner, introVideo } = req.files || {}

            let existCourse = await pool.query(`select * from courses where id = $1`, [id])
            if (!existCourse.rows.length) {
                return next(new ErrorException(404, "Course not found with this id"))
            }

            let currentCourse = existCourse.rows[0]

            if (req.user.role === "teacher" && currentCourse.teacher_id !== req.user.id) {
                return next(new ErrorException(403, "You cannot update this course!"))
            }

            let fileNameBanner = currentCourse.banner
            let fileNameIntroVideo = currentCourse.intro_video

            if (banner) {
                fileNameBanner = Date.now() + "." + banner.mimetype.split("/")[1]

                const allowFileType = ["png", "jpg", "jpeg", "svg"]

                if (!allowFileType.includes(banner.mimetype.split("/")[1])) {
                    return next(new ErrorException(415, "Unsupported mediatype"))
                }
                await banner.mv(process.cwd() + "/src/uploads/banners/" + fileNameBanner, (error) => {
                    if (error) {
                        return next(new ErrorException(500, error))
                    }
                })
            }

            if (introVideo) {
                fileNameIntroVideo = Date.now() + "." + introVideo.mimetype.split("/")[1]

                const allowFileType = ["mp4", "mpeg", "mov", "avi", "mkv", "webm", "ogv", "3gp", "wmv", "flv"]


                if (!allowFileType.includes(introVideo.mimetype.split("/")[1])) {
                    return next(new ErrorException(415, "Unsupported mediatype"))
                }
                await introVideo.mv(process.cwd() + "/src/uploads/introvideos/" + fileNameIntroVideo, (error) => {
                    if (error) {
                        return next(new ErrorException(500, error))
                    }
                })
            }

            let updateName = name ? name : currentCourse.name
            let updateDescription = description ? description : currentCourse.description
            let updateLevel = level ? level : currentCourse.level
            let updatePrice = price ? price : currentCourse.price
            let updateCategoryId = category_id ? category_id : currentCourse.category_id

            await pool.query(`update courses set banner=$1, intro_video=$2, name=$3, description=$4, level=$5, price=$6, category_id=$7 where id = $8`,
                [fileNameBanner, fileNameIntroVideo, updateName, updateDescription, updateLevel, updatePrice, updateCategoryId, id])

            return {
                status: 201,
                message: "Course updated successfully!"
            }

        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async deleteCourse(req, res, next) {
        try {
            let { id } = req.params
            let existCourse = await pool.query(`select * from courses where id = $1`, [id])

            if (!existCourse.rows.length) {
                return next(new ErrorException(404, "Course not found with this id"))
            }
            if (req.user.role === "teacher" && existCourse.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "You cannot delete this course!"))
            }
            await pool.query(`update courses set status = 'inactive' where id = $1`, [id])
            return {
                status: 200,
                message: "Course deleted!"
            }

        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async courseApproved(req, res, next) {
        try {
            const { courseId } = req.params

            let course = await pool.query(`select * from courses where id = $1`, [courseId])
            let purchased = course.rows[0].purchased

            await pool.query(`update courses set purchased = ${!purchased} where id = $1`, [courseId])

            return {
                status: 200,
                message: "Course status changed!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
}

const coursesService = new CoursesService()

export default coursesService