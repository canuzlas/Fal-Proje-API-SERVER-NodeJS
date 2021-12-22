const express = require('express')
const router = express.Router()
const burcApiController = require('../controller/burcapi-controller')

router.get('/get/:burc', burcApiController.getBurc)
router.get('/get/:burc/:zaman', burcApiController.getBurcZaman)
router.get('/gets/:burc/:ozellik', burcApiController.getBurOzellik)

module.exports = router