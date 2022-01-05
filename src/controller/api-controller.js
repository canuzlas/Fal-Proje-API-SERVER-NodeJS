const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const usersModel = require('../models/users-model')
const falModel = require('../models/fal-model')
const bannedUserModel = require('../models/banneduser-model');
const { saveActivity } = require('../models/activitylog-model')
const appNotificationModel = require('../models/app-notifications-model')
const md5 = require('md5')
const fs = require('fs')
const path = require('path');

const apiJwt = async (req, res) => {

   const token = await jwt.sign({ device: req.body.device }, process.env.JWT_SECRET, { expiresIn: '1h' })
   return res.send({ token: token })

}
const signUp = async (req, res) => {
   try {
      if (req.query.method == 'google') {
         if (req.body.verifyCode == req.session.verifyCode && req.body.secretPass === 'AqWqRq34252234ASADafasd+^dfsdf') {
            const result = await jwt.verify(req.body.token, process.env.JWT_SECRET)
            if (result.device == req.body.device) {
               const user = await new usersModel({ name: req.body.name, mail: req.body.mail, pass: md5(req.body.password), verify: true, didsend: false })
               await user.save()
               return res.send({ data: user, success: true, coffeeCount: 0, tarotCount: 0 })
            } else {
               return res.send({ success: false })
            }
         } else {
            return res.send({ success: false })
         }
      } else {
         const result = await jwt.verify(req.body.token, process.env.JWT_SECRET)
         if (result.device == req.body.device) {
            const user = await new usersModel({ name: req.body.name, mail: req.body.mail, pass: md5(req.body.password), didsend: false })
            await user.save()
            return res.send({ data: user, success: true, coffeeCount: 0, tarotCount: 0 })
         } else {
            return res.send({ success: false })
         }
      }
   } catch (error) {
      saveActivity('Sign Up Error', String(error))
      return res.send({ success: false })
   }
}
const checkEmailİsUsable = async (req, res) => {
   const result = await bannedUserModel.find({ mail: req.body.mail })
   if (result.length) {
      return res.send({ success: false })
   } else {
      const result = await usersModel.find({ mail: req.body.mail, verify: true })
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
                  const coffeeCount = await falModel.count({ u_id: result.map(user => user._id), type: 'coffee' })
                  const tarotCount = await falModel.count({ u_id: result.map(user => user._id), type: 'tarot' })
                  res.send({ data: result, coffeeCount: coffeeCount, tarotCount: tarotCount, success: true })
               } else {
                  res.send({ success: false })
               }
            } else {
               res.send({ success: "error" })
            }
         } catch (error) {
            saveActivity('Sign İn Email Error', String(error))
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
                     const coffeeCount = await falModel.count({ u_id: result.map(user => user._id), type: 'coffee' })
                     const tarotCount = await falModel.count({ u_id: result.map(user => user._id), type: 'tarot' })
                     res.send({ data: result, coffeeCount: coffeeCount, tarotCount: tarotCount, success: true })
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
            saveActivity('Sign İn Google Error', String(error))
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
            saveActivity('Update Profile Name Error', String(error))
            res.send({ success: "error" })
         }
         break;
      case "mail":
         try {
            const result = await jwt.verify(req.body.token, process.env.JWT_SECRET)
            console.log(result)
            if (result.device == req.body.device) {
               console.log(req.body.u_id)
               const updateResult = await usersModel.findByIdAndUpdate(req.body.u_id, { mail: req.body.mail, verify: false })
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
            saveActivity('Update Profile Mail Error', String(error))
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
      saveActivity('Update PP Error', String(error))
      return res.send({ success: false })
   }
}
const updatePhotoForCoffeeFal = async (req, res) => {
   const result = await bannedUserModel.find({ mail: req.body.mail })
   if (result.length) {
      return res.send({ success: false })
   } else {
      try {
         if (req.query.verify == 'true') {
            const result = await jwt.verify(req.body.token, process.env.JWT_SECRET)
            if (result.device == req.body.device) {
               const user = await usersModel.find({ _id: req.body.u_id, verify: true })
               if (user.length) {
                  if (user[0].didsend) {
                     return res.send({ success: "didsend" })
                  } else {
                     req.session.u_id = req.body.u_id
                     return res.send({ success: true })
                  }
               } else {
                  return res.send({ success: false })
               }
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
               const data = await new falModel({ u_id: req.session.u_id, photos: photos, type: 'coffee' })
               await data.save()
               if (data) {
                  await usersModel.findByIdAndUpdate(req.session.u_id, { didsend: true })
                  return res.send({ success: true })
               } else {
                  return res.send({ success: false })
               }
            } else {
               return res.send({ success: false })
            }
         }
         if (req.query.tarot == 'true') {

            const data = await new falModel({ u_id: req.session.u_id, cards: req.body.cards, type: 'tarot' })
            await data.save()

            if (data) {
               await usersModel.findByIdAndUpdate(req.session.u_id, { didsend: true })
               return res.send({ success: true })
            } else {
               return res.send({ success: false })
            }

         }
      } catch (error) {
         saveActivity('Fal Error', String(error))
         return res.send({ success: false })
      }

   }
}
const getAllFall = async (req, res) => {
   try {
      const result = await jwt.verify(req.body.token, process.env.JWT_SECRET)
      if (result.device == req.body.device) {
         const user = await usersModel.findById(req.body.u_id)
         if (user) {
            const fals = await falModel.find({ u_id: req.body.u_id }).sort({ createdAt: '-1' }).limit(10)
            const notifications = await appNotificationModel.find().sort({ createdAt: '-1' }).limit(10)
            return res.send({ notifications: notifications, data: fals, success: true })
         } else {
            return res.send({ success: false })
         }
      } else {
         return res.send({ success: false })
      }
   } catch (error) {
      saveActivity('Get All Fal Error for User', String(error))
      return res.send({ success: false })
   }
}
const verifyMail = async (req, res) => {
   try {
      const result = await jwt.verify(req.body.token, process.env.JWT_SECRET)
      if (result.device == req.body.device) {
         if (req.query.updateverify) {
            if (req.session.verifyCode == req.body.verifyCode) {
               const result = await usersModel.findByIdAndUpdate(req.body.id, { verify: true })
               if (result) {
                  req.session.destroy()
                  return res.send({ success: true })
               } else {
                  return res.send({ success: false })
               }
            } else {
               return res.send({ success: false })
            }
         }
         const user = await usersModel.find({ _id: req.body.id, verify: false })
         if (user.length) {
            const randomCode = await Math.floor(100000 + Math.random() * 900000)
            const transporter = nodemailer.createTransport({
               host: "mail.falhub.com",
               port: 465,
               secure: true, // upgrade later with STARTTLS
               auth: {
                  user: "mailer@falhub.com",
                  pass: "s2ciyuzl4s",
               },
            });

            const mailOptions = {
               from: 'mailer@falhub.com',
               to: user[0].mail,
               subject: 'Verify Account',
               html: 'Merhaba' + '<p style="color:black;font-weight:bold;padding-left:10px">' + user[0].name + ',</p>' +

                  'Falhub uygulamasında hesabınızı onaylamak için. <br><br>' +
                  'Doğrulama Kodunuz: ' + '<p style="color:black;font-weight:bold;padding-left:10px">' + randomCode + '</p>'
            };

            transporter.sendMail(mailOptions, function (error, info) {
               if (error) {
                  console.log(error);
                  return res.send({ success: false })
               } else {
                  transporter.close()
                  req.session.verifyCode = randomCode
                  return res.send({ success: true, verifyCode: randomCode })
               }
            });
         } else {
            return res.send({ success: false })
         }
      } else {
         return res.send({ success: false })
      }
   } catch (error) {
      saveActivity('Verify Email Error', String(error))
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
   getAllFall,
   verifyMail
}