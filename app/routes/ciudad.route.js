const router = require('express').Router();
const ciudad = require('../controllers/ciudad.controller')

router.get('/', ciudad.getCiudad)
router.post('/', ciudad.addCiudad)

module.exports = router