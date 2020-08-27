const TodoListModel = require('../../models/TodoModel/TodoModel').TodoListsModel;
const TodoModel = require('../../models/TodoModel/TodoModel').TodoModel;
const UserModel = require('../../models/UserModel/UserModel').UserModel;


module.exports = function (app) {

    // create new List
    app.post('/todo', async (req, res) => {
        // decosntruct data
        const { listTitle } = req.body;

        console.log(req.body)
        if (req.user === null) return res.sendStatus(401);

        try {
            // find user
            const user = await UserModel.findOne({ email: req.user.email });

            // create and save TodoList
            const todoList = new TodoListModel();
            listTitle === undefined ? null : todoList.title = listTitle;
            await todoList.save();

            // add TodoList to User models and save 
            user.todoLists.push(todoList);
            await user.save();

            console.log(todoList)

            // return
            return res.sendStatus(201)

        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    })

    app.get('/todo-list-of-lists', async (req, res) => {
        console.log(req.cookies)
        // return fobridden if no user
        if (req.user === null || typeof req.user.email === 'undefined') return res.sendStatus(403);

        // find user in db
        const user = await UserModel.findOne({ email: req.user.email })
        res.status(200);
        res.json(user.todoLists)
    })
}

