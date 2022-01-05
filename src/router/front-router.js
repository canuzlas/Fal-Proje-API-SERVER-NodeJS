const express = require('express')
const router = express.Router()
const frontController = require('../controller/front-controller')


router.get('/', frontController.getHomePage)
router.get('/policy', frontController.getPolicyPage)
router.get('/privacy', frontController.getPrivacyPage)


module.exports = router