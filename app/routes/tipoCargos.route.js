const router = require('express').Router();
const tipoCargos = require('../controllers/tipoCargos.controller');

router.get('/:sd_cdgo', tipoCargos.getTipoCargos)
router.post('/', tipoCargos.addCargo)
module.exports = router