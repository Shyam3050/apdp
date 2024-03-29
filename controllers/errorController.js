const AppError = require("../utils/appError");

function handelCastErrDB(err) {
  const message = `invalid ${err.path} and value ${err.value}`;
  return new AppError(message, 400);
}
function handleDupFieldsDB(err) {
  const errMsg = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${errMsg} please use another name`;
  return new AppError(message, 400);
}

function sendErrDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}
function sendErrPrd(err, res) {
  console.log(err);
  if (err.isOperational) {
    res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: "Please try again later.",
    });
  } else {
    res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: "Please try again later.",
    });
  }
}
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.static || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    if (error.name === "CastError") error = handelCastErrDB(error);
    if (error.code === 11000) error = handleDupFieldsDB(error);
    //   if (error.name === "ValidationError") error = handleValidationError(error);
    //   if (error.name === "JsonWebTokenError") error = handleJwtError(error);
    //   if (error.name === "TokenExpiredError") error = handleTokenExp(error)
    sendErrPrd(error, res);
  }

  next();
};
