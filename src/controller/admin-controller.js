const adminModel = require('../models/admin-model')
const falModel = require('../models/fal-model')
const usersModel = require('../models/users-model')
const appNotificationModel = require('../models/app-notifications-model')
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
   const result = await falModel.find({ yorum: null, type: 'coffee' }).sort({ createdAt: '1' })
   return res.render('admin/commit-fal', { layout: 'layout/tables-layout.ejs', fallar: result, title: 'Kahve Yorumla', admin: req.session.admin })
}
const commitThisFal = async (req, res) => {
   const result = await falModel.findById(req.query.id)
   const user = await usersModel.findById(result.u_id)
   return res.render('admin/commitfor-fal', { layout: 'layout/tables-layout.ejs', title: 'Yorum Yap', fal: result, user: user, admin: req.session.admin })
}

const addCommitThisFal = async (req, res) => {
   console.log(req.body)
   const result = await falModel.findByIdAndUpdate(req.query.falid, { yorum: req.body.commit })
   if (result) {
      return res.send({ success: true })
   } else {
      return res.send({ success: false })
   }
}

const yorumlananfallarPage = async (req, res) => {
   const result = await falModel.find({ yorum: { $ne: null }, type: 'coffee' }).sort({ updatedAt: '-1' })
   return res.render('admin/didcommit-fals', { layout: 'layout/tables-layout.ejs', fallar: result, title: 'Yorumlanan Fallar', admin: req.session.admin })
}

const sendNotification = async (req, res) => {
   const notification = await new appNotificationModel(req.body)
   const result = await notification.save()
   if (result) {
      return res.send({ success: true })
   } else {
      return res.send({ success: false })
   }
}

const allNotification = async (req, res) => {
   const result = await appNotificationModel.find().sort({ createdAt: '-1' })
   return res.render('admin/allnotification', { layout: 'layout/tables-layout.ejs', notifications: result, title: 'Tüm Bildirimler', admin: req.session.admin })
}
const deleteNotification = async (req, res) => {
   const result = await appNotificationModel.findByIdAndDelete(req.body.id)
   if (result) {
      return res.send({ success: true })
   } else {
      return res.send({ success: false })
   }
}

const allUsers = async (req, res) => {
   const result = await usersModel.find().sort({ createdAt: '-1' })
   return res.render('admin/allusers', { layout: 'layout/tables-layout.ejs', users: result, title: 'Tüm Üyeler', admin: req.session.admin })
}

const deleteUser = async (req, res) => {
   const result = await usersModel.findByIdAndDelete(req.body.id)
   if (result) {
      return res.send({ success: true })
   } else {
      return res.send({ success: false })
   }
}

module.exports = { getLoginPage, postLoginPage, getHomePage, adminLogout, commitFalPage, commitThisFal, addCommitThisFal, yorumlananfallarPage, sendNotification, allNotification, deleteNotification, allUsers, deleteUser }