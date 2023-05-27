const router = require('express').Router();
const empresas = require('../controllers/empresa.controller');

router.get('/', empresas.getEmpresas)
router.get('/:em_cdgo', empresas.searchEmpresa)
router.post('/', empresas.addEmpresa)
router.put('/:em_cdgo', empresas.updateEmpresa)
router.delete('/:em_cdgo', empresas.deleteEmpresa)

module.exports = router