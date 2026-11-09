const { Router } = require('express');
const controller = require('../controllers/relatorioController');

const router = Router();

router.get('/semanal', controller.semanal);

module.exports = router;
