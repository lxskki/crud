const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Função para criar um novo usuário
exports.createUser = (req, res) => {
  const { name, email, password } = req.body;
  
  // Verificar se o email já está cadastrado
  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, result) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else if (result.length > 0) {
      res.status(400).json({ message: 'Email já cadastrado!' });
    } else {
      // Hash da senha
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          res.status(500).json({ message: 'Erro ao criptografar senha!' });
        } else {
          const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
          
          db.query(query, [name, email, hashedPassword], (err, result) => {
            if (err) {
              res.status(500).json({ message: err.message });
            } else {
              res.status(201).json({ id: result.insertId, name, email });
            }
          });
        }
      });
    }
  });
};

// Função de login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  
  const query = 'SELECT * FROM users WHERE email = ?';
  
  db.query(query, [email], (err, result) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'Usuário não encontrado' });
    } else {
      const user = result[0];
      // Comparar a senha fornecida com a do banco
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          res.status(500).json({ message: 'Erro ao comparar senhas!' });
        } else if (isMatch) {
          res.json({ message: 'Login bem-sucedido', user: { id: user.id, email: user.email } });
        } else {
          res.status(401).json({ message: 'Senha incorreta' });
        }
      });
    }
  });
};

// Função para listar todos os usuários
exports.getAllUsers = (req, res) => {
  const query = 'SELECT * FROM users';
  
  db.query(query, (err, result) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.json(result);
    }
  });
};

// Função para obter um usuário pelo ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'Usuário não encontrado' });
    } else {
      res.json(result[0]);
    }
  });
};

// Função para atualizar um usuário
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  const query = 'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?';
  
  db.query(query, [name, email, age, id], (err, result) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Usuário não encontrado' });
    } else {
      res.json({ message: 'Usuário atualizado com sucesso' });
    }
  });
};

// Função para excluir um usuário
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Usuário não encontrado' });
    } else {
      res.json({ message: 'Usuário excluído com sucesso' });
    }
  });
};
