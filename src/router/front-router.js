const express = require('express')
const router = express.Router()
const frontController = require('../controller/front-controller')


router.get('/', frontController.getHomePage)

module.exports = router