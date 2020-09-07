const { Router } = require('express');
const controllers = require('../controllers/TodoController');


const router = Router();

router.post('/todo', () => { });

router.post('/todo-item-remove', controllers.removeTodoItem)
router.post('/todo-item-toggle-status', controllers.toggleTaskStatus)
router.get('/todo-list', controllers.todoList)


router.post('/add-todo-item', controllers.addTodoItem);

module.exports = router;