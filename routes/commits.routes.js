const router = require('express').Router()
const { commitsController } = require('../controllers')

router.get('/', commitsController.everything)
router.get('/:id', commitsController.byUser)
router.post('/', commitsController.addCommits)


module.exports = router
