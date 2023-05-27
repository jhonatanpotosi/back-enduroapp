const router = require('express').Router();
const convenios = require('../controllers/convenios.controller');

router.get('/:co_cdgo', convenios.searchConvenio)
router.post('/', convenios.addConvenio)
router.put('/:co_cdgo', convenios.updateConvenio)
router.delete('/:co_cdgo', convenios.deleteConvenios)

module.exports = router