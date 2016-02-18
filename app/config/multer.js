var multer = require('multer'),
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/images/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
  }),

  filter = (req, file, cb) => {
    if (['image/gif', 'image/jpeg'].indexOf(file.mimetype) !== -1) {
      return cb(null, true);
    }
    cb(req.res.status(415).json({
      success: false,
      message: 'Invalid file type. Only \'jpeg\' and \'gif\' Images are allowed'
    }));
  },

  limits = {
    fileSize: 10000000
  },

  upload = multer({
    storage: storage,
    fileFilter: filter,
    limits: limits
  });

module.exports = upload;
