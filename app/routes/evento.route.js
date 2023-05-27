const router = require('express').Router();
const eventos = require('../controllers/evento.controller');

router.get('/', eventos.getEventos)
router.get('/:ev_cdgo', eventos.searchEvento)
router.post('/', eventos.addEvento)
router.put('/:ev_cdgo', eventos.updateEvento) 
router.delete('/:em_cdgo', eventos.deleteEvento)

module.exports = router