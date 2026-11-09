const { Router } = require('express');
const controller = require('../controllers/configuracaoController');

const router = Router();

router.get('/', controller.consultar);
router.put('/', controller.atualizar);

module.exports = router;
