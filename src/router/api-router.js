const express = require('express')
const router = express.Router()
const apiController = require('../controller/api-controller')

router.post('/',apiController.apiJwt)
router.post('/checkEmail',apiController.checkEmailİsUsable)
router.post('/register',apiController.signUp)
router.post('/login',apiController.login)

module.exports = router