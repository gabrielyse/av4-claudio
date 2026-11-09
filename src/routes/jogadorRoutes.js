const { Router } = require('express');
const controller = require('../controllers/jogadorController');

const router = Router();

router.post('/', controller.cadastrar);
router.get('/', controller.listar);
router.get('/:id', controller.consultar);
router.put('/:id', controller.atualizar);
router.patch('/:id/desativar', controller.desativar);

module.exports = router;
