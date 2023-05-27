const router = require('express').Router();
const firebase = require('../controllers/FireBase.controller');

router.post('/notificar/:us_cdgo', firebase.notificar)

module.exports = router