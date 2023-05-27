const router = require('express').Router();
const quejasReclamos = require('../controllers/pqrs.controller');

router.get('/', quejasReclamos.getQuejasReclamos)
router.post('/', quejasReclamos.addQuejasReclamos)

module.exports = router