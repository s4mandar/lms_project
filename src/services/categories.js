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
    
    async updateCategory(req, res, next) {
        try {
            let { id } = req.params || {}
            let { name } = req.body || {}

            let existCategory = await pool.query(`select * from categories where id = $1`, [id])
            if (!existCategory.rows.length) {
                return next(new ErrorException(404, "Category not found with this id"))
            }

            if (name) {
                let dup = await pool.query(`select id from categories where lower(name) = lower($1) and id != $2`, [name, id])
                if (dup.rows.length) {
                    return next(new ErrorException(409, "Category already exist with this name"))
                }
            }

            let updateName = name ?? existCategory.rows[0].name

            await pool.query(`update categories set name = $1 where id = $2`, [updateName, id])

            return {
                status: 201,
                message: "Category updated!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async deleteCategory(req, res, next) {
        try {
            let { id } = req.params

            let existCategory = await pool.query(`select * from categories where id = $1`, [id])

            if (!existCategory.rows.length) {
                return next(new ErrorException(404, "Category not found with this id"))
            }

            await pool.query(`update categories set status = 'inactive' where id = $1`, [id])

            return {
                status: 200,
                message: "Category deleted!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
}

const categoryService = new CategoryService()

export default categoryService