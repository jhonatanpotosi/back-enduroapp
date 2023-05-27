const router = require('express').Router();
const bitacoras = require('../controllers/bitacora.controller');
const verify = require('../middlewares/verifyToken')

router.get('/', bitacoras.getBitacoras)
router.get('/inicio', bitacoras.getBitacorasInicio)
router.post('/', bitacoras.addBitacora)
router.put('/delete/:bi_cdgo', bitacoras.deleteBitacoras)

module.exports = router