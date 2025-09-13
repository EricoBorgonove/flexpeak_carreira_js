const express = require('express');
const router = express.Router();

const ImovelController = require('../controllers/ImovelController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Rota pública — lista todos os imóveis
router.get('/', ImovelController.list);



// Rotas privadas (somente locador autenticado)
router.post('/', authMiddleware, roleMiddleware('locador'), ImovelController.create);

// Novo endpoint: listar imóveis do locador logado
router.get('/meus', authMiddleware, roleMiddleware('locador'), ImovelController.meusImoveis);

router.put('/:id', authMiddleware, roleMiddleware('locador'), ImovelController.update);
router.delete('/:id', authMiddleware, roleMiddleware('locador'), ImovelController.remove);

// Rota pública — busca imóvel por ID
router.get('/:id', ImovelController.getById);


module.exports = router;
