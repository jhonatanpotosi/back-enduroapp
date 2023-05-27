const router = require('express').Router();
const tipoConvenios = require('../controllers/tipoConvenios.controller')

router.get('/:em_cdgo', tipoConvenios.getTipoConvenios)

module.exports = router