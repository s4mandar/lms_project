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
}

const categoryController = new CategoryController()

export default categoryController