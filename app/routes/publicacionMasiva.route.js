const router = require('express').Router();
const publicacionesMasivas = require('../controllers/publicacionMasiva.controller');

router.get('/', publicacionesMasivas.getPublicacionesMasivas)
router.get('/inicio', publicacionesMasivas.getPublicacionesMasivasInicio)
router.put('/:pu_cdgo', publicacionesMasivas.updatePublicacionMasiva) 
router.post('/', publicacionesMasivas.addPublicacionMasiva)

module.exports = router