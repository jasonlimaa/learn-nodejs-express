function notFound(req, res, next) {
    return res.status(404).json({
        status: 404, success: false, message: "Route not found",
    });
}

function expressErrorHandler(error, req, res, next) {
    const status = error?.status || 500;
    const message = error?.message || "internalServerError";
    return res.status(status).json({
        status, success: false, message,
    });
}

module.exports = {
    notFound, expressErrorHandler,
};
