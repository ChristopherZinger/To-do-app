const { Router } = require('express');
const router = Router();
const { TodoModel, TodoListsModel } = require('../models/TodoModel');
const { UserModel } = require('../../auth/models/AuthModels');

function handleErrors(error) {
    console.log(error)
    if (error === 'You need to log in again') {
        return {
            status: 401,
            msg: 'You don\'t have access. Log in again.'
        }
    }
}

module.exports.addList = async (req, res) => {
    //find lists
    console.log('[todoController.js] ', res.user)

    try {
        if (!res.user) throw Error('You need to log in again')
        const newListTitle = req.body.listTitle;

        const user = await UserModel.findById(res.user._id)

        const newList = new TodoListsModel({ title: newListTitle });
        await newList.save();
        user.todoLists.push(newList);
        await user.save();

        return res.status(200).json({ listOfIds: user.todoLists })


    } catch (err) {
        const error = handleErrors(err);
        if (!error) return res.status(400).json({ error: 'Bad request.' })
        return res.status(error.status).json({ error: error.msg })
    }
}


module.exports.getListOfLists = async (req, res) => {

    //find lists
    console.log('[todoController.js] ', res.user)

    try {
        if (!res.user) throw Error('You need to log in again')

        const listOfIds = await TodoListsModel.find({ '_id': { $in: res.user.todoLists } })

        res.status(200).json({ listOfIds })


    } catch (err) {
        const error = handleErrors(err);
        if (!error) return res.status(400).json({ error: 'Bad request.' })
        return res.status(error.status).json({ error: error.msg })
    }
}

module.exports.removeList = async (req, res) => {
    try {
        if (!res.user) throw Error('You need to log in again')
        const listId = req.body.listId;

        const list = await TodoListsModel.findByIdAndDelete(listId);

        const user = await UserModel.findById(res.user._id);
        user.todoLists = user.todoLists.filter(list => list._id !== listId);// remove list id from users list array
        await user.save();
        res.sendStatus(200);


    } catch (err) {
        const error = handleErrors(err);
        if (!error) return res.status(400).json({ error: 'Bad request.' })
        return res.status(error.status).json({ error: error.msg })
    }
}