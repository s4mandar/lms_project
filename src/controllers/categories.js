import categoryService from "../services/categories.js"

class CategoryController {
    async getAllCategories(req, res, next) {
        let resData = await categoryService.getAllCategories()
        return res.status(resData.status).json(resData)
    }
    async createCategory(req, res, next) {
        let resData = await categoryService.createCategory(req, res, next)

        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }
    async updateCategory(req, res, next) {
        let resData = await categoryService.updateCategory(req, res, next)

        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }
    async deleteCategory(req, res, next) {
        let resData = await categoryService.deleteCategory(req, res, next)

        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }
}

const categoryController = new CategoryController()

export default categoryController