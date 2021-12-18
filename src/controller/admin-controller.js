const adminModel = require('../models/admin-model')
const coffeeFalModel = require('../models/coffeeFalPhotos')
const usersModel = require('../models/users-model')
const md5 = require('md5')

// ne yorum : { $ne: null }


const getLoginPage = (req, res) => {
   res.render('admin/admin-login', { layout: 'layout/login-layout.ejs' })
}

const postLoginPage = async (req, res) => {
   try {
      const result = await adminModel.findOne({ $or: [{ mail: req.body.username, pass: md5(req.body.password) }, { username: req.body.username, pass: md5(req.body.password) }] })
      if (result) {
         req.session.admin = result
         return res.send({ success: true })
      } else {
         return res.send({ success: false })
      }
   } catch (error) {
      return res.send({ success: 'error' })
   }
}

const getHomePage = (req, res) => {
   res.render('admin/admin-home', { layout: 'layout/home-layout.ejs', admin: req.session.admin })
}

const adminLogout = (req, res) => {
   req.session.destroy(() => {
      return res.redirect('/staff/admin')
   })
}

const commitFalPage = async (req, res) => {
   const result = await coffeeFalModel.find({ yorum: null }).sort({ createdAt: '1' })
   return res.render('admin/commit-fal', { layout: 'layout/tables-layout.ejs', fallar: result, title: 'Kahve Yorumla', admin: req.session.admin })
}
const commitThisFal = async (req, res) => {
   const result = await coffeeFalModel.findById(req.query.id)
   const user = await usersModel.findById(result.u_id)
   return res.render('admin/commitfor-fal', { layout: 'layout/tables-layout.ejs', title: 'Yorum Yap', fal: result, user: user, admin: req.session.admin })
}

const addCommitThisFal = async (req, res) => {
   console.log(req.body)
   const result = await coffeeFalModel.findByIdAndUpdate(req.query.falid, { yorum: req.body.commit })
   if (result) {
      return res.send({ success: true })
   } else {
      return res.send({ success: false })
   }
}

const yorumlananfallarPage = async (req, res) => {
   const result = await coffeeFalModel.find({ yorum: { $ne: null } }).sort({ updatedAt: '-1' })
   return res.render('admin/didcommit-fals', { layout: 'layout/tables-layout.ejs', fallar: result, title: 'Yorumlanan Fallar', admin: req.session.admin })
}


module.exports = { getLoginPage, postLoginPage, getHomePage, adminLogout, commitFalPage, commitThisFal, addCommitThisFal, yorumlananfallarPage }