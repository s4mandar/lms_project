import { InternalSeverError, UnauthorizedError } from "../utils/error.js"
import { verifyToken } from "../utils/jwt.js"

export const authGuard = (req, res, next) => {
    try {
        let { token } = req.headers

        if (!token) {
            return next(new UnauthorizedError(401, "Token is required!"))
        }

        let user = verifyToken(token)
        req.user = user
        return next()
    } catch (error) {
        if (error.name == "JsonWebTokenError") {
            return next(new UnauthorizedError(401, error.message))
        }
        if (error.name == "TokenExpiredError") {
            return next(new UnauthorizedError(401, error.message))
        }
        return next(new InternalSeverError(500, "Internal server error!"))
    }
}