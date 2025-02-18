import { config } from "../config/config.js";

const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: "",
                location: "",
                stack: config.env === "development" ? err.stack : ""
            }
        ]
    })
}

export default globalErrorHandler;