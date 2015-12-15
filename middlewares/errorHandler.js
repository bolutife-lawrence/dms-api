module.exports = {
    setError: (req, res, next) => {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    },

    throwErrorDev: (err, req, res, next) => {
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: err.stack
      });
    },

    throwError: (err, req, res, next) => {
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: {}
      });
    },
};
