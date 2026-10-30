import { ForbiddenError, InternalSeverError } from "../utils/error.js"

export const roleGuard = (...roles) => {
    return (req, res, next) => {
        try {
            if (!roles.includes(req.user.role)) {
                return next(new ForbiddenError(403, "Forbidden"))
            }
            return next()
        } catch (error) {
            return next(new InternalSeverError(500, error))
        }
    }
}