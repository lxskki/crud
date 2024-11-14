const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota para registrar um novo usuário
router.post('/register', userController.createUser);

// Rota para login de um usuário
router.post('/login', userController.loginUser);

// Rota para listar todos os usuários (opcional)
router.get('/', userController.getAllUsers);

// Rota para obter um usuário pelo ID
router.get('/:id', userController.getUserById);

// Rota para atualizar um usuário
router.put('/:id', userController.updateUser);

// Rota para excluir um usuário
router.delete('/:id', userController.deleteUser);

module.exports = router;
