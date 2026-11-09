const { Router } = require('express');
const controller = require('../controllers/treinoController');

const router = Router();

router.post('/', controller.registrar);
router.get('/', controller.listar);
router.get('/jogador/:id', controller.listarPorJogador);
router.delete('/:codigo', controller.excluir);

module.exports = router;
