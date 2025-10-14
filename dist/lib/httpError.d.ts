declare class HttpError extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string);
}
export default HttpError;
//# sourceMappingURL=httpError.d.ts.map