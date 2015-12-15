var ext = require('./ext');
module.exports = {
  customValidators: {
    isDoc: function (docName) {
      var extn = ext.getExt(docName);
      if (extn === undefined) return false;
      return ext.checkExt(extn);
    }
  }
};
