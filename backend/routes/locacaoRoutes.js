const express = require('express');
const router = express.Router();

const LocacaoController = require('../controllers/LocacaoController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Aplicar middleware: apenas locatários autenticados
router.use(authMiddleware);
router.use(roleMiddleware('locatario'));

// Criar locação
router.post('/', LocacaoController.create);

// Listar todas as locações do locatário logado
router.get('/', LocacaoController.list);

// Buscar locação por ID
router.get('/:id', LocacaoController.getById);

// Cancelar (deletar) locação
router.delete('/:id', LocacaoController.remove);

module.exports = router;
