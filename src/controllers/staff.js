import staffservice from "../services/staff.js"

class StaffController {
    constructor() { }

    async getAllStaff(req, res) {
        let resData = await staffservice.getStaffs()
        return res.status(resData.status).json(resData)
    }

    async createStaff(req, res, next) {
        let resData = await staffservice.createStaff(req, res, next)
        if (resData.status >= 400) {
        }

        return res.status(resData.status).json(resData)
    }

    async deleteStaff(req, res, next) {
        let resData = await staffservice.deleteStaff(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }
}

const staffController = new StaffController()

export default staffController