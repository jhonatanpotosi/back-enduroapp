const router = require('express').Router();
const verify = require('../middlewares/verifyToken')

router.use('/sede', require('./sede.route'));
router.use('/ciudad', require('./ciudad.route'));
router.use('/evento', verify.token,require('./evento.route'));
router.use('/empresa', verify.token,  require('./empresa.route'));
router.use('/tipo_convenios', verify.token, require('./tipoConvenios.route'))
router.use('/tipo_cargos',  require('./tipoCargos.route'))
router.use('/usuarios', require('./usuario.route'))
router.use('/convenios', verify.token, require('./convenios.route'));
router.use('/pqrs', verify.token, require('./pqrs.route'));
router.use('/vehiculo', verify.token, require('./vehiculo.route'));
router.use('/publicacion_masiva', verify.token, require('./publicacionMasiva.route'));
router.use('/bitacora', verify.token,  require('./bitacora.route'));
router.use('/mesa_trabajo', require('./mesaTrabajo.route'));
router.use('/auth', require('./auth.route'));
router.use('/image', require('./image.route'));
router.use('/firebase', require('./FireBase.route'));
router.use('/emergencias', require('./emergencias.route'));

module.exports = router