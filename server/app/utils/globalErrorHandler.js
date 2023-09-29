module.exports.globalErrorHandler = (err, req, res, next) => {
  const isLocal = err?.isLocal ?? false;
  const statusCode = err.statusCode || 400;
  const status = `${statusCode}`.startsWith("4") ? "fail" : "error";

  if (isLocal) {
    res.status(statusCode).json({
      status,
      message: err.message,
      more: err.more,
    });
  } else {
    res.status(statusCode).json({
      status,
      message: err.message,
    });
  }
};
