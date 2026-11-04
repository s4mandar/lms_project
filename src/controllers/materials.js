import materialService from "../services/materials.js"

class MaterialsController {
    constructor() { }

    async getMaterialByLessonId(req, res, next) {
        let resData = await materialService.getMaterialByLessonId(req, res, next)
        if(resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async getAllMaterials(req, res, next) {
        let resData = await materialService.getAllMaterials(req, res, next)
        if(resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async createMaterial(req, res, next) {
        let resData = await materialService.createMaterial(req, res, next)
        if(resData) {
            return res.status(resData.status).json(resData)
        }
    }

    // async updateMaterial(req, res, next) {
    //     let resData = await materialService.updateMaterial(req, res, next)
    //     if(resData) {
    //         return res.status(resData.status).json(resData)
    //     }
    // }

    // async deleteMaterial(req, res, next) {
    //     let resData = await materialService.deleteMaterial(req, res, next)
    //     if (resData) {
    //         return res.status(resData.status).json(resData)
    //     }
    // }
}

const materialsController = new MaterialsController()

export default materialsController