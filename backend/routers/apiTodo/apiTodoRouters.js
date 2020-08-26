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

}

