const express = require('express')
const router = express.Router()
const apiController = require('../controller/api-controller')
const multer = require('../config/multer')

router.post('/', apiController.apiJwt)
router.post('/checkEmail', apiController.checkEmailİsUsable)
router.post('/register', apiController.signUp)
router.post('/login', apiController.login)
router.post('/updateProfile', apiController.updateProfile)
router.post('/updatePhoto', multer.userMulter.single('file'), apiController.updatePhoto)

module.exports = router