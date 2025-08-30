const express = require('express');
const router = express.Router();

const ImovelController = require('../controllers/ImovelController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Rota pública — lista todos os imóveis
router.get('/', ImovelController.list);

// Rota pública — busca imóvel por ID
router.get('/:id', ImovelController.getById);

// Rotas privadas (somente locador autenticado)
router.post('/', authMiddleware, roleMiddleware('locador'), ImovelController.create);
router.put('/:id', authMiddleware, roleMiddleware('locador'), ImovelController.update);
router.delete('/:id', authMiddleware, roleMiddleware('locador'), ImovelController.remove);

module.exports = router;
