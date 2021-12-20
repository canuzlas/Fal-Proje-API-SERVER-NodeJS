const jwt = require('jsonwebtoken')
const usersModel = require('../models/users-model')
const coffeeFalModel = require('../models/coffeeFalPhotos')
const appNotificationModel = require('../models/app-notifications-model')
const md5 = require('md5')
const fs = require('fs')
const path = require('path')


const apiJwt = async (req, res) => {

   const token = await jwt.sign({ device: req.body.device }, process.env.JWT_SECRET, { expiresIn: '1h' })
   return res.send({ token: token })

}
const signUp = async (req, res) => {
   try {
      if (req.query.method == 'google') {
         console.log('google')
         if (req.body.verifyCode == req.session.verifyCode && req.body.secretPass === 'AqWqRq34252234ASADafasd+^dfsdf') {
            const result = await jwt.verify(req.body.token, process.env.JWT_SECRET)
            if (result.device == req.body.device) {
               const user = await new usersModel({ name: req.body.name, mail: req.body.mail, pass: md5(req.body.password) })
               await user.save()
               return res.send({ data: user, success: true, coffeeCount: 0 })
            } else {
               return res.send({ success: false })
            }
         } else {
            return res.send({ success: false })
         }
      } else {
         console.log('google else')
         const result = await jwt.verify(req.body.token, process.env.JWT_SECRET)
         if (result.device == req.body.device) {
            const user = await new usersModel({ name: req.body.name, mail: req.body.mail, pass: md5(req.body.password) })
            await user.save()
            return res.send({ data: user, success: true, coffeeCount: 0 })
         } else {
            return res.send({ success: false })
         }
      }
   } catch (error) {
      console.log('google error')
      return res.send({ success: false })
   }
}
const checkEmailİsUsable = async (req, res) => {
   const result = await usersModel.find({ mail: req.body.mail })
   if (result.length) {
      if (req.query.forgoogle == 'true' && req.body.secretPass === 'AqWqRq34252234ASADafasd+^dfsdf') {

         req.session.verifyCode = req.body.verifyCode

         return res.send({ success: false, verifyCode: req.session.verifyCode })
      } else {

         return res.send({ success: false })
      }
   } else {
      if (req.query.forgoogle == 'true' && req.body.secretPass === 'AqWqRq34252234ASADafasd+^dfsdf') {

         req.session.verifyCode = req.body.verifyCode

         return res.send({ success: true, verifyCode: req.session.verifyCode })
      } else {

         return res.send({ success: true })
      }
   }
}
const login = async (req, res) => {
   switch (req.query.method) {
      case "email":
         try {
            const result = await jwt.verify(req.body.token, process.env.JWT_SECRET)
            if (result.device == req.body.device) {
               const pass = await md5(req.body.password)
               const result = await usersModel.find({ mail: req.body.mail, pass: pass })

               if (result.length) {
                  const count = await coffeeFalModel.count({ u_id: result.map(user => user._id) })
                  res.send({ data: result, coffeeCount: count, success: true })
               } else {
                  res.send({ success: false })
               }
            } else {
               res.send({ success: "error" })
            }
         } catch (error) {
            res.send({ success: "error" })
         }
         break;
      case "google":
         try {
            if (req.body.verifyCode == req.session.verifyCode && req.body.secretPass === 'AqWqRq34252234ASADafasd+^dfsdf') {
               const result = await jwt.verify(req.body.token, process.env.JWT_SECRET)
               if (result.device == req.body.device) {
                  const result = await usersModel.find({ mail: req.body.mail })
                  if (result.length) {
                     const count = await coffeeFalModel.count({ u_id: result.map(user => user._id) })
                     res.send({ data: result, coffeeCount: count, success: true })
                  } else {
                     res.send({ success: false })
                  }
               } else {
                  res.send({ success: "error" })
               }
            } else {
               res.send({ success: "error" })
            }
         } catch (error) {
            res.send({ success: "error" })
         }
         break;
   }
}
const updateProfile = async (req, res) => {
   switch (req.query.place) {
      case "name":
         try {
            const result = await jwt.verify(req.body.token, process.env.JWT_SECRET)
            console.log(result)
            if (result.device == req.body.device) {
               console.log(req.body.u_id)
               const updateResult = await usersModel.findByIdAndUpdate(req.body.u_id, { name: req.body.name })
               if (updateResult) {
                  const user = await usersModel.findById(updateResult._id)
                  if (user) {
                     res.send({ success: true, data: user })
                  } else {
                     res.send({ success: "error" })
                  }
               } else {
                  res.send({ success: "error" })
               }
            } else {
               res.send({ success: "error" })
            }
         } catch (error) {
            res.send({ success: "error" })
         }
         break;
      case "mail":
         try {
            const result = await jwt.verify(req.body.token, process.env.JWT_SECRET)
            console.log(result)
            if (result.device == req.body.device) {
               console.log(req.body.u_id)
               const updateResult = await usersModel.findByIdAndUpdate(req.body.u_id, { mail: req.body.mail })
               if (updateResult) {
                  const user = await usersModel.findById(updateResult._id)
                  if (user) {
                     res.send({ success: true, data: user })
                  } else {
                     res.send({ success: "error" })
                  }
               } else {
                  res.send({ success: "error" })
               }
            } else {
               res.send({ success: "error" })
            }
         } catch (error) {
            res.send({ success: "error" })
         }
         break;
   }
}
const updatePhoto = async (req, res) => {
   try {
      if (req.query.verify == 'true') {
         const result = await jwt.verify(req.body.token, process.env.JWT_SECRET)
         if (result.device == req.body.device) {
            req.session.u_id = req.body.u_id
            return res.send({ success: true })
         } else {
            return res.send({ success: false })
         }
      }
      if (req.query.savePhoto == 'true') {
         if (req.file) {
            const updatedUser = await usersModel.findByIdAndUpdate(req.session.u_id, { photo: req.file.filename })
            if (updatedUser) {
               updatedUser.photo != 'false' ? fs.unlink(path.resolve(__dirname, '../uploads/usersPhoto/' + updatedUser.photo), (err) => err ? console.log(err) : console.log('fotoğraf silindi')) : null
               const user = await usersModel.findById(updatedUser._id)
               return res.send({ success: true, data: user })
            } else {
               return res.send({ success: false })
            }
         } else {
            return res.send({ success: false })
         }
      }
   } catch (error) {
      return res.send({ success: false })
   }
}
const updatePhotoForCoffeeFal = async (req, res) => {
   try {
      if (req.query.verify == 'true') {
         const result = await jwt.verify(req.body.token, process.env.JWT_SECRET)
         if (result.device == req.body.device) {
            req.session.u_id = req.body.u_id
            return res.send({ success: true })
         } else {
            return res.send({ success: false })
         }
      }
      if (req.query.savePhoto == 'true') {
         if (req.files) {
            const photos = new Array()
            const resultsPhotos = req.files
            resultsPhotos.forEach(photo => {
               photos.push(photo.filename)
            });
            const data = await new coffeeFalModel({ u_id: req.session.u_id, photos: photos })
            await data.save()
            if (data) {
               return res.send({ success: true })
            } else {
               return res.send({ success: false })
            }
         } else {
            return res.send({ success: false })
         }
      }
   } catch (error) {
      return res.send({ success: false })
   }
}
const getAllFall = async (req, res) => {
   try {
      const result = await jwt.verify(req.body.token, process.env.JWT_SECRET)
      if (result.device == req.body.device) {
         console.log(req.body.u_id)
         const fals = await coffeeFalModel.find({ u_id: req.body.u_id }).sort({ createdAt: '-1' }).limit(10)
         const notifications = await appNotificationModel.find().sort({ createdAt: '-1' }).limit(10)
         return res.send({ notifications: notifications, data: fals, success: true })
      } else {
         return res.send({ success: false })
      }
   } catch (error) {
      console.log(error)
      return res.send({ success: false })
   }
}

module.exports = {
   apiJwt,
   signUp,
   checkEmailİsUsable,
   login,
   updateProfile,
   updatePhoto,
   updatePhotoForCoffeeFal,
   getAllFall
}