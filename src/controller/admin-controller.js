const adminModel = require('../models/admin-model')
const falModel = require('../models/fal-model')
const nodemailer = require("nodemailer");
const usersModel = require('../models/users-model')
const appNotificationModel = require('../models/app-notifications-model')
const { saveActivity, activityLogModel } = require('../models/activitylog-model')
const bannedUserModel = require('../models/banneduser-model')
const fbdatabase = require('../config/firebaseConfig')

const md5 = require('md5')
// ne yorum : { $ne: null }
const getLoginPage = (req, res) => {
   res.render('admin/admin-login', { layout: 'layout/login-layout.ejs' })
}
const postLoginPage = async (req, res) => {
   try {
      const result = await adminModel.findOne({ $or: [{ mail: req.body.username, pass: md5(req.body.password) }, { username: req.body.username, pass: md5(req.body.password) }] })
      req.session.admin = result
      return res.send({ success: true })

      /* 
      if (result) {
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
            from: "mailer@falhub.com",
            to: result.mail,
            subject: 'Verify Admin',
            html: 'Merhaba' + '<p style="color:black;font-weight:bold;padding-left:10px">' + result.username + ',</p>' +

               'Falhub admin paneline girebilmek için. <br><br>' +
               'Doğrulama Kodunuz: ' + '<p style="color:black;font-weight:bold;padding-left:10px">' + randomCode + '</p>'
         };

         transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
               console.log(error);
               return res.send({ success: false })
            } else {
               transporter.close()
               req.session.ifadmin = result
               req.session.verifyAdmin = randomCode
               saveActivity('Admin Verify Page Redirect', String(result.username))
               return res.send({ success: true })
            }
         });
      } else {
         saveActivity('Admin Hatalı Giriş', String(req.body.username))
         return res.send({ success: false })
      }
      */

   } catch (error) {
      saveActivity('Admin Giriş Error', String(req.body.username))
      return res.send({ success: 'error' })
   }
}
const showAdminVerifyPage = (req, res) => {
   res.render('admin/admin-verify', { layout: 'layout/login-layout.ejs' })
}
const verifyToAdmin = (req, res) => {
   if (req.session.verifyAdmin == req.body.code) {
      saveActivity('Admin Giriş', String(req.session.ifadmin.username))
      delete req.session.verifyAdmin
      req.session.admin = req.session.ifadmin
      delete req.session.ifadmin
      return res.send({ success: true })
   } else {
      return res.send({ success: false })
   }
}
const getHomePage = (req, res) => {
   res.render('admin/admin-home', { layout: 'layout/home-layout.ejs', admin: req.session.admin })
}
const adminLogout = (req, res) => {
   saveActivity('Admin Çıkış', String(req.session.admin.username))
   req.session.destroy(() => {
      return res.redirect('/staff/admin')
   })
}
const commitFalPage = async (req, res) => {
   const result = await falModel.find({ yorum: null }).sort({ createdAt: '1' })
   return res.render('admin/commit-fal', { layout: 'layout/tables-layout.ejs', fallar: result, title: 'Fal Yorumla', admin: req.session.admin })
}
const commitThisFal = async (req, res) => {
   const result = await falModel.findById(req.query.id)
   const user = await usersModel.findById(result.u_id)
   return res.render('admin/commitfor-fal', { layout: 'layout/tables-layout.ejs', title: 'Yorum Yap', fal: result, user: user, admin: req.session.admin })
}
const addCommitThisFal = async (req, res) => {
   console.log(req.body)
   const result = await falModel.findByIdAndUpdate(req.query.falid, { yorum: req.body.commit, whodidcommit: req.session.admin.username })
   if (result) {
      await usersModel.findByIdAndUpdate(result.u_id, { didsend: false })
      saveActivity('Fal Yorum Yapıldı', String(req.session.admin.username))
      return res.send({ success: true })
   } else {
      usersModel.findByIdAndUpdate(result.u_id, { didsend: false })
      saveActivity('Fal Yorum Hata', String(req.session.admin.username))
      return res.send({ success: false })
   }
}
const yorumlananfallarPage = async (req, res) => {
   const result = await falModel.find({ yorum: { $ne: null } }).sort({ updatedAt: '-1' })
   return res.render('admin/didcommit-fals', { layout: 'layout/tables-layout.ejs', fallar: result, title: 'Yorumlanan Fallar', admin: req.session.admin })
}
const getOneCommit = async (req, res) => {
   const result = await falModel.findById(req.body.id)
   if (result) {
      return res.send({ success: true, commit: result.yorum })
   } else {
      return res.send({ success: false })
   }
}
const deleteFal = async (req, res) => {
   const result = await falModel.findByIdAndDelete(req.body.id)
   if (result) {
      saveActivity('Fal Yorum Silindi', String(req.session.admin.username))
      return res.send({ success: true })
   } else {
      saveActivity('Fal Yorum Silme Hata', String(req.session.admin.username))
      return res.send({ success: false })
   }
}
const sendNotification = async (req, res) => {
   const notification = await new appNotificationModel(req.body)
   const result = await notification.save()
   if (result) {
      saveActivity('Uygulama Bildirim Yollandı', String(req.session.admin.username))
      return res.send({ success: true })
   } else {
      saveActivity('Uygulama Bildirim Hata', String(req.session.admin.username))
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
      saveActivity('Uygulama Bildirim Silindi', String(req.session.admin.username))
      return res.send({ success: true })
   } else {
      saveActivity('Uygulama Bildirim Silme Hata', String(req.session.admin.username))
      return res.send({ success: false })
   }
}
const allUsers = async (req, res) => {
   const users = await usersModel.find().sort({ createdAt: '-1' })
   const bannedusers = await bannedUserModel.find()
   return res.render('admin/allusers', { layout: 'layout/tables-layout.ejs', users: users, bannedusers: bannedusers, title: 'Tüm Üyeler', admin: req.session.admin })
}
const deleteUser = async (req, res) => {
   const result = await usersModel.findByIdAndDelete(req.body.id)
   if (result) {
      saveActivity('Üye Silindi', String(req.session.admin.username))
      return res.send({ success: true })
   } else {
      saveActivity('Üye Silme Hata', String(req.session.admin.username))
      return res.send({ success: false })
   }
}
const doBanUser = async (req, res) => {
   const result = await usersModel.findByIdAndDelete(req.body.id)
   if (result) {
      const bannedUser = await new bannedUserModel({ mail: result.mail })
      await bannedUser.save()
      saveActivity('Üye Banlandı', String(req.session.admin.username))
      return res.send({ success: true })
   } else {
      saveActivity('Üye Banlandı Hata', String(req.session.admin.username))
      return res.send({ success: false })
   }
}
const doUnBanUser = async (req, res) => {
   const result = await bannedUserModel.findByIdAndDelete(req.body.id)
   if (result) {
      saveActivity('Üye Banı Kaldırıldı', String(req.session.admin.username))
      return res.send({ success: true })
   } else {
      saveActivity('Üye Banı Kaldırıldı Hata', String(req.session.admin.username))
      return res.send({ success: false })
   }
}
const getAllActivitylog = async (req, res) => {
   const result = await activityLogModel.find().sort({ createdAt: '-1' })
   return res.render('admin/allactivity', { layout: 'layout/tables-layout.ejs', activities: result, title: 'Tüm Aksiyonlar', admin: req.session.admin })
}
const getPageLiveChats = async (req, res) => {

   fbdatabase.ref('/spchat').once('value', (snapshot) => {
      let data = []
      snapshot.forEach(res => {
         data.push(res.key)
      })
      return res.render('admin/live-chats', { layout: 'layout/tables-layout.ejs', messages: data, title: 'Canlı Destek', admin: req.session.admin })
   })
   
}
const liveChatForId = async (req, res) => {
   req.session.userId = req.query.id
   return res.render('admin/live-chats-user', { layout: 'layout/tables-layout.ejs', userId: req.query.id, title: req.query.id + ' Üye Sohbet', admin: req.session.admin })
}
const getShowSendfbcm = async (req, res) => {
   return res.render('admin/sendfbcm', { layout: 'layout/tables-layout.ejs', title: 'Firebase Cloud Message', admin: req.session.admin })
}
const sendFbcm = async (req, res) => {
   console.log(req.body)
   fbdatabase.ref('/notification').set({ title: req.body.title, body: req.body.body }, (err) => {
      if (!err) {
         return res.send({ success: true })
      } else {
         return res.send({ success: false })
      }
   })
}

module.exports = { getLoginPage, postLoginPage, showAdminVerifyPage, verifyToAdmin, getHomePage, adminLogout, commitFalPage, commitThisFal, addCommitThisFal, yorumlananfallarPage, getOneCommit, deleteFal, sendNotification, allNotification, deleteNotification, allUsers, deleteUser, doBanUser, doUnBanUser, getAllActivitylog, getPageLiveChats, liveChatForId, getShowSendfbcm, sendFbcm }