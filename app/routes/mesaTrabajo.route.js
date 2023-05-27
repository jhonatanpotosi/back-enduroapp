const router = require('express').Router();
const mesa_trabajo = require('../controllers/mesaTrabajo.controller');

/* router.get('/:co_cdgo', convenios.searchConvenio) */
router.post('/', mesa_trabajo.addMesaTrabajo)
router.put('/:us_cdgo', mesa_trabajo.deleteUserMesaTrabajo)
router.delete('/:sd_cdgo', mesa_trabajo.deleteMesaTrabajo)
// router.delete('/:sd_cdgo', sedes.deleteSede)
//  */
module.exports = router