const TodoListModel = require('../../models/TodoModel/TodoModel').TodoListsModel;
const TodoModel = require('../../models/TodoModel/TodoModel').TodoModel;



module.exports = function (app) {

    app.get('/todo', (req, res) => {
        console.log('user : ', req.user.email)
        res.sendStatus(200);
    })

}

