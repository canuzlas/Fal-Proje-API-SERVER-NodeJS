const multer = require('multer');
const path = require('path');

const myMulterStorage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../uploads/usersPhoto'))
   },

   filename: function (req, file, cb) {
      const fileName = Date.now() + path.extname(file.originalname);
      cb(null, fileName);
   }
})

const myMulterFileFilter = function (req, file, cb) {
   if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg')
      cb(null, true)
   else
      cb(null, false)
}

const userMulter = multer({ storage: myMulterStorage, fileFilter: myMulterFileFilter });
module.exports = { userMulter }