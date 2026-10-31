import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

class CategoryService {

    async getAllCategories(req, res, next) {
        try {
            const categories = await pool.query(`select * from categories`)

            return {
                status: 200,
                data: categories.rows
            }
        } catch (error) {
            next(new ErrorException(500, "Internal server error!"))
        }
    }


    async createCategory(req, res, next) {
        try {
            const { name } = req.body
            let existCategory = await pool.query(`select * from categories where name = $1`, [name])
            if (existCategory.rows.length) {
                return next(new ErrorException(409, "Category already exist with this name"))
            }

            await pool.query(`insert into categories(name) 
                values($1)`, [name])

            return {
                status: 201,
                message: "Category added!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
}

const categoryService = new CategoryService()

export default categoryService