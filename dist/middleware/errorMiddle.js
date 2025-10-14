import HttpError from "../lib/httpError.js";
import { ZodError } from "zod";
function error_handler(error, req, res, next) {
    if (error instanceof ZodError) {
        return res.status(400).json({ success: false, errors: error.issues });
    }
    if (error instanceof HttpError) {
        return res.status(error.status).json({ success: false, message: error.message });
    }
    const status = error.status || 500;
    const message = error.message || "INTERNAL SERVER ERROR";
    return res.status(status).json({ success: false, message: message });
}
export default error_handler;
//# sourceMappingURL=errorMiddle.js.map