const jwt = require('jsonwebtoken')
const usersModel = require('../models/users-model')
const md5 = require('md5')


const apiJwt = async (req, res) => {

   const token = await jwt.sign({ device: req.body.device }, process.env.JWT_SECRET, { expiresIn: '1h' })
   return res.send({ token: token })

}
const signUp = async (req, res) => {
   const result = await jwt.verify(req.body.token, process.env.JWT_SECRET)
   try {
      if (result.device == req.body.device) {
         const user = await new usersModel({ name: req.body.name, mail: req.body.mail, pass: md5(req.body.password) })
         await user.save()
         return res.send({ data: user, success: true })
      } else {
         return res.send({ success: false })
      }
   } catch (error) {
      return res.send({ success: false })
   }
}
const checkEmailİsUsable = async (req, res) => {
   const result = await usersModel.find({ mail: req.body.mail })
   if (result.length) {
      return res.send({ success: false })
   } else {
      return res.send({ success: true })
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
                  res.send({ data: result, success: true })
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
               const user = await usersModel.findById(updatedUser._id)
               return res.send({ success: true, data: user })
            } else {
               return res.send({ success: false })
            }
            console.log(updatedUser)
         } else {
            return res.send({ success: false })
         }
      }
   } catch (error) {
      return res.send({ success: false })
   }

}


module.exports = {
   apiJwt,
   signUp,
   checkEmailİsUsable,
   login,
   updateProfile,
   updatePhoto
}