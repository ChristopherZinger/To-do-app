const { Router } = require('express');
const controllers = require('../controllers/TodoListsController');


const router = Router();

router.get('/todo-list-of-lists', controllers.getListOfLists);
router.post('/remove-list', controllers.removeList)
router.post('/add-list', controllers.addList)

module.exports = router;