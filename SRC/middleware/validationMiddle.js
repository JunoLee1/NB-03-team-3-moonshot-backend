export function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "본문 body 검증 실패",
                error: result.error.flatten()
            });
        }
        req.body = result.data;
        next();
    };
}
export function validateQuery(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            return res.status(400).json({
                message: "본문 query 검증 실패",
                error: result.error.flatten()
            });
        }
        req.query = result.data;
        next();
    };
}
export function validateParam(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            return res.status(400).json({
                message: "본문 params 검증 실패",
                error: result.error.flatten()
            });
        }
        req.params = result.data;
        next();
    };
}
