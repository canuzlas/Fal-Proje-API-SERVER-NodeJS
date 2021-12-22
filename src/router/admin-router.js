const express = require('express')
const router = express.Router()
const adminController = require('../controller/admin-controller')
const middleWares = require('../middleware/admin-session-check')

//login
router.get('/', adminController.getLoginPage)
router.post('/', adminController.postLoginPage)
//home
router.get('/home', middleWares.adminCheck, adminController.getHomePage)
router.get('/logout', middleWares.adminCheck, adminController.adminLogout)
//commit fal
router.get('/commitfal', middleWares.adminCheck, adminController.commitFalPage)
router.get('/commitfor', middleWares.adminCheck, adminController.commitThisFal)
router.get('/yorumlananfallar', middleWares.adminCheck, adminController.yorumlananfallarPage)
router.post('/addcommit', middleWares.adminCheck, adminController.addCommitThisFal)
//notification
router.post('/sendNotification', middleWares.adminCheck, adminController.sendNotification)
router.post('/deleteNotification', middleWares.adminCheck, adminController.deleteNotification)
router.get('/allnotification', middleWares.adminCheck, adminController.allNotification)
//users
router.get('/allusers', middleWares.adminCheck, adminController.allUsers)
router.post('/deleteuser', middleWares.adminCheck, adminController.deleteUser)





module.exports = router