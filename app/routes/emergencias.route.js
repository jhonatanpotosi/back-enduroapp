const router = require('express').Router();
const emergencias = require('../controllers/emergencias.controller');

router.get('/', emergencias.getEmergencias)

module.exports = router