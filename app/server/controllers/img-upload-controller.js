var uploadController = (_validate, cloudinary, models, co) => {
  var userImgUpload = (req, res) => {
      if (req.file || req.files) {
        var path = req.file.path,
          cb = (err, uploadResp) => {
            if (uploadResp) {
              res.json(uploadResp);
            } else {
              res.status(err.status_code || 500).json({
                success: false,
                message: err.message
              });
            }
          },
          query = {
            _id: req.user._id
          },
          imgUpdate = {};

        cloudinary.uploader.upload(path, (result) => {
          if (result && !result.error) {
            co(function* () {
              imgUpdate = yield models.User.findOneAndUpdate(query, {
                img_public_id: result.public_id,
                img_url: result.url
              });
            });
            if (imgUpdate) {
              cb(null, {
                success: true,
                img_url: result.url,
                public_id: result.public_id
              });
            } else {
              cb({
                status_code: 500,
                message: 'Update was not successful'
              }, null);
            }
          } else {
            cb({
              status_code: null,
              message: result.error.message
            }, null);
          }
        });
      } else {
        res.status(400)
          .json({
            success: false,
            message: 'Please provide a file(image) path'
          });
      }
    },

    _delete = (req, res, next) => {
      _validate.validatePubId(req, (err) => {
        if (err) res.status(400).json(err);
      });
      cloudinary.uploader.destroy(req.params.id, (result) => {
        if (result) {
          req.info = result;
          next();
        }
      });
    },

    deleteImage = (req, res) => {
      var query = {
          _id: req.user._id
        },
        prevResult = req.info;
      co(function* () {
        try {
          if (prevResult && !prevResult.error) {
            var updated = yield models.User.findOneAndUpdate(query, {
              img_public_id: null,
              img_url: 'http://res.cloudinary.com/dms/image/upload/' +
                'c_scale,h_275,q_98,r_30/v1453209823/' +
                'default_avatar_fnm9wb.gif'
            });
            if (!updated) {
              res.status(501)
                .json({
                  success: false,
                  message: 'Image was not deleted'
                });
            } else {
              res.status(200).json({
                success: true,
                img_url: 'http://res.cloudinary.com/dms/image/upload/' +
                  'c_scale,h_275,q_98,r_30/v1453209823/' +
                  'default_avatar_fnm9wb.gif'
              });
            }
          }
        } catch (e) {
          console.log(e);
        }
      });
    };

  return {
    userImgUpload: userImgUpload,
    delete: _delete,
    deleteImage: deleteImage
  };
};

module.exports = uploadController;
