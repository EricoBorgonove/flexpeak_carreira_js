const express = require ('express')
const UserController = require('../controllers/UserController')
const router = express.Router()

// Criar Usuário
router.post ('/', UserController.createUser)
// Listar todos os usuários
router.get ('/', UserController.getAllUsers)
//Buscar Usuário por ID
router.get('/:id', UserController.getUserById)
// Buscar por e-mail (/user/buscar/email?email=teste@email.com)
router.get('/buscar/email', UserController.findByEmail)
//Buscar por nome (/user/buscar/name?name=ana)
router.get('/buscar/nome', UserController.findByName)
// Atualizar usuário
router.put('/:id', UserController.updateUser)
// Deletar usuário
router.delete('/:id', UserController.deleteUser)

module.exports = router;
