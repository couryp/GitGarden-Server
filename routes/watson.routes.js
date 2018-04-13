const router = require('express').Router()
const {watsonController}  = require('../controllers')
router.post('/analyzeTone', watsonController.analyzeTone)

module.exports = router
