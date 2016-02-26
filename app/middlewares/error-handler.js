module.exports = {
  throwError: (req, res) => {
    res.status(404)
      .json({
        success: false,
        message: 'Requested resource not found'
      });
  }
};
