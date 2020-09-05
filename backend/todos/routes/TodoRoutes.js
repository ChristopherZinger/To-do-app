const { Router } = require('express');
const controllers = require('../controllers/TodoController');


const router = Router();

router.post('/todo', controllers.createTodoList);
router.get('/todo-list-of-lists', controllers.getListOfLists);


module.exports = router;