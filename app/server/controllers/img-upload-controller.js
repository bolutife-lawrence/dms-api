var uploadController = (_validate, cloudinary, models, co) => {
  var userImgUpload = (req, res) => {
      if (req.files || req.file) {
        var path = req.file.path,
          cb = (err, imageUrl) => {
            if (imageUrl) {
              res.json(imageUrl);
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
          imgUpdate = '';

        cloudinary.uploader.upload(path, (result) => {
          if (result && !result.error) {
            console.log(result);
            co(function* () {
              try {
                imgUpdate = yield models.User.findOneAndUpdate(query, {
                  img_public_id: result.public_id,
                  img_url: result.url
                });
              } catch (e) {
                console.log(e);
              }
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
              img_url: null
            });
            if (!updated) {
              res.status(501)
                .json({
                  success: false,
                  message: 'Image was not deleted'
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
