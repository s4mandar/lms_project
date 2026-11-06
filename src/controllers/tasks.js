import taskService from "../services/tasks.js"

class TaskController {
    constructor() { }

    async getTaskByLessonId(req, res, next) {
        let resData = await taskService.getTaskByLessonId(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async getAllTasks(req, res, next) {
        let resData = await taskService.getAllTasks(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async createTask(req, res, next) {
        let resData = await taskService.createTask(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async updateTask(req, res, next) {
        let resData = await taskService.updateTask(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async deleteTask(req, res, next) {
        let resData = await taskService.deleteTask(req, res, next)
        if (resData) {
            return res.status(resData.status).json(resData)
        }
    }
}

const taskController = new TaskController()

export default taskController