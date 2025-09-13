const express = require('express');
const router = express.Router();

const LocacaoController = require('../controllers/LocacaoController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Aplicar middleware: apenas locatários autenticados
router.use(authMiddleware);
router.use(roleMiddleware('locatario'));

// Criar locação
router.post(
  '/',
  authMiddleware,
  (req, res, next) => {
    // permite tanto locatário quanto locador
    if (['locador', 'locatario'].includes(req.usuario.tipo_usuario)) {
      return next();
    }
    return res.status(403).json({ message: 'Apenas usuários autenticados podem criar locações' });
  },
  LocacaoController.create
);


// Listar todas as locações do locatário logado
router.get('/', LocacaoController.list);


// Rota exclusiva para locatários (suas locações)
router.get('/minhas', authMiddleware, roleMiddleware('locatario'), LocacaoController.minhasLocacoes);

// Buscar locação por ID
router.get('/:id', LocacaoController.getById);

// Cancelar (deletar) locação
router.delete('/:id', LocacaoController.remove);


module.exports = router;
