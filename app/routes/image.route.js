const router = require('express').Router();
const image = require('../controllers/image.controller');

router.get('/get', image.getImage)

module.exports = router