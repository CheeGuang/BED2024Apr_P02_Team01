const errorHandler = (error, req, res, next) => {
  if (error) {
    if (error.message) {
      res.status(400).json({
        status: "Failed!",
        error: error.message,
      });
    } else {
      res.status(400).json({
        status: "Failed!",
        error: error,
      });
    }
  } else {
    next();
  }
};

module.exports = errorHandler;
