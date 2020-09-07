const { Router } = require('express');
const controllers = require('../controllers/TodoListsController');


const router = Router();

// router.post('/todo', controllers.createTodoList);


router.get('/todo-list-of-lists', controllers.getListOfLists);
// router.get('/todo-list')
router.post('/remove-list', controllers.removeList)
router.post('/add-list', controllers.addList)

module.exports = router;