const TodoListModel = require('../../models/TodoModel/TodoModel').TodoListsModel;
const TodoModel = require('../../models/TodoModel/TodoModel').TodoModel;
const UserModel = require('../../models/UserModel/UserModel').UserModel;
const mongoose = require('mongoose');

module.exports = function (app) {

    // create new List
    app.post('/add-list', async (req, res) => {

        // check if user is authenticated
        if (req.user === null) return res.sendStatus(401);

        // decosntruct data
        const { listTitle } = req.body;

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

            // return
            return res.sendStatus(201)

        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    })

    app.get('/todo-list-of-lists', async (req, res) => {
        // return fobridden if no user
        if (req.user === null || typeof req.user.email === 'undefined') return res.sendStatus(401);

        // find user in db
        try {

            // find user
            const user = await UserModel.findOne({ email: req.user.email });

            // find lists
            const query = user.todoLists.map(listItem => mongoose.Types.ObjectId(listItem));
            const lists = await TodoListModel.find({ '_id': { $in: query } })

            // return response
            res.status(200);
            res.json(lists)
        } catch (err) {
            console.log(err)
            res.sendStatus(500)
        }
    })

    app.post('/remove-list', async (req, res) => {
        // return fobridden if no user
        if (req.user === null || typeof req.user.email === 'undefined') return res.sendStatus(401);


        try {
            const { listId } = req.body;

            const list = await TodoListModel.findOneAndDelete({ '_id': listId })
            if (list !== null) {
                return res.sendStatus(200)
            } else {
                return res.sendStatus(400)
            }


        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    })


    app.get('/todo-list', async (req, res) => {
        // return fobridden if no user
        if (req.user === null || typeof req.user.email === 'undefined') return res.sendStatus(401);

        try {
            const { listId } = req.query;
            if (listId === undefined) return res.sendStatus(400);

            // find todolist
            const list = await TodoListModel.findById(listId);
            if (list === null) return res.sendStatus(400);

            // fidn task objects
            const todoQuery = list.tasks.map(taskId => mongoose.Types.ObjectId(taskId));
            const tasksObjects = await TodoModel.find({ '_id': { $in: todoQuery } });
            const updatedlist = {
                ...list,
                tasks: tasksObjects
            }

            return res.status(200).json(updatedlist);

        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    })

    app.post('/add-todo-item', async (req, res) => {
        // return fobridden if no user
        if (req.user === null || typeof req.user.email === 'undefined') return res.sendStatus(401);

        try {
            const { taskTitle, todoListId } = req.body;
            console.log('taskTitle : ', taskTitle, ' todoListId : ', todoListId);
            const list = await TodoListModel.findById(todoListId);
            console.log('list : ', list);
            const todoItem = new TodoModel({
                taskTitle: taskTitle
            })
            console.log('todoItem : ', todoItem);
            await todoItem.save();
            list.tasks.push(todoItem)
            console.log('list.tasks : ', list.tasks);
            await list.save();

            const todoQuery = list.tasks.map(task => mongoose.Types.ObjectId(task))
            const tasksObjects = await TodoModel.find({ '_id': { $in: todoQuery } })

            res.status(201).json(tasksObjects)

        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }

    })

    app.post('/todo-item-remove', async (req, res) => {
        // return fobridden if no user
        if (req.user === null || typeof req.user.email === 'undefined') return res.sendStatus(401);

        try {
            const { itemId } = req.body;

            const removedItem = await TodoModel.findOneAndDelete({ '_id': itemId });
            if (removedItem === null) return res.sendStatus(400);
            return res.sendStatus(200);

        } catch (error) {
            console.log(error);
            return res.sendStatus(500)
        }
    })
}

