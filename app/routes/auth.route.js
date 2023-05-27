const router = require('express').Router();
const verify = require('../middlewares/verifyToken')
const auth = require('../controllers/auth.controller')

router.post('/signin', auth.signIn)
router.post('/verify', verify.token , auth.verify)

module.exports = router