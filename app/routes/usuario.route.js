const router = require('express').Router();
const usuarios = require('../controllers/usuarios.controller');
const verify = require('../middlewares/verifyToken')
router.get('/', verify.token, usuarios.findUsuarios)
router.get('/solicitudes', verify.token , usuarios.getSolicitudUsuarios)
router.get('/validate', usuarios.validar)
router.get('/lista_sede', usuarios.getSedesList)
router.get('/mesa_trabajo/:sd_cdgo', usuarios.getUsuarioMesaTrabajo)
router.get('/buscar_id/:us_cdgo', usuarios.findUsuarioId)
router.get('/notificar/:us_cdgo', usuarios.notificar)
router.get('/buscar_placa/:ve_placa', verify.token, usuarios.findUsuarioPlaca)
router.post('/', usuarios.addUsuario)
router.put('/cambio_imagen/:us_cdgo', verify.token, usuarios.updateImage)
router.put('/cambio_perfil/:us_cdgo', verify.token, usuarios.updatePerfil)
router.put('/cambio_data/:us_cdgo', verify.token, usuarios.updateData)
router.put('/cambio_estado/:us_cdgo', verify.token, usuarios.updateEstado)
router.put('/aceptar_eliminar_usuario/:us_cdgo', verify.token, usuarios.aceptarEliminarUsuario)
router.put('/actualizar_token_fb/:us_cdgo',  verify.token, usuarios.updateToken)

module.exports = router