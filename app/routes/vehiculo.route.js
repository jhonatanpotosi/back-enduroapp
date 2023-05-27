const router = require('express').Router();
const vehiculos = require('../controllers/vehiculo.controller');

router.get('/', vehiculos.getVehiculos)
router.get('/verificacion_documentos', vehiculos.verificacionDocumentos)
router.get('/:ve_cdgo', vehiculos.searchVehiculo)
router.delete('/:ve_cdgo', vehiculos.deletevehiculo)
router.post('/', vehiculos.addVehiculo)

module.exports = router