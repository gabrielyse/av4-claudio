const { Router } = require('express');

const router = Router();

router.use('/jogadores', require('./jogadorRoutes'));
router.use('/configuracao', require('./configuracaoRoutes'));
router.use('/treinos', require('./treinoRoutes'));
router.use('/relatorios', require('./relatorioRoutes'));

module.exports = router;
