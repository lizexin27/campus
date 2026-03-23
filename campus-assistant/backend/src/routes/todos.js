const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { auth } = require('../middleware/auth');

// 所有路由都需要认证
router.use(auth);

// 待办路由
router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);
router.patch('/:id', todoController.toggleTodo);

module.exports = router;