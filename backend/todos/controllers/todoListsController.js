const { Router } = require('express');
const router = Router();
const { TodoModel, TodoListsModel } = require('../models/TodoModel');
const { UserModel } = require('../../auth/models/AuthModels');
const path = require('path');


function handleErrors(error) {
    console.log("[todoListsCon] Error Handling : \n ", error)

    switch (error) {
        case 'You need to log in again':
            return {
                status: 401,
                msg: 'You don\'t have access. Log in again.'
            }

        case 'Access token points to nonexisting user.':
            return {
                status: 400,
                msg: 'Something went wrong. Try logout and log in again.'
            }

        case 'This model does NOT exists.':
            return {
                status: 400,
                msg: 'Element you are looking for does NOT exists.'
            }

        case 'Missing data.':
            return {
                status: 400,
                msg: 'Element you are looking for does NOT exists.'
            }

        default:
            return {
                status: 500,
                msg: 'Something went wrong.'
            }
    } // swith
} // error handling 

module.exports.addList = async (req, res) => {
    try {
        //user
        if (!res.user) throw Error('You need to log in again')
        const user = await UserModel.findById(res.user._id)
        if (!user) throw Error('Access token points to nonexisting user.')

        // new todo list
        const newListTitle = req.body.listTitle;
        if (!newListTitle) throw Error('Missing data.')
        const newList = new TodoListsModel({ title: newListTitle });
        await newList.save();
        user.todoLists.push(newList);
        await user.save();

        return res.status(200).json({ listOfIds: user.todoLists })

    } catch (err) {
        const error = handleErrors(err);
        return res.status(error.status).json({ error: error.msg })
    }
}

module.exports.getListOfLists = async (req, res) => {
    try {
        if (!res.user) throw Error('You need to log in again')

        const listOfIds = await TodoListsModel.find({ '_id': { $in: res.user.todoLists } })
        res.status(200).json({ listOfIds })

    } catch (err) {
        const error = handleErrors(err);
        return res.status(error.status).json({ error: error.msg })
    }
}

module.exports.removeList = async (req, res) => {
    try {
        //User
        if (!res.user) throw Error('You need to log in again')
        const user = await UserModel.findById(res.user._id);
        if (!user) throw Error('Access token points to nonexisting user.')

        const listId = req.body.listId;
        if (!listId) throw Error('Missing data.');
        const list = await TodoListsModel.findByIdAndDelete(listId);
        if (!list) throw Error('This model does NOT exists.')
        user.todoLists = user.todoLists.filter(list => list._id !== listId);// remove list id from users list array

        await user.save();
        res.sendStatus(200);

    } catch (err) {
        const error = handleErrors(err);
        return res.status(error.status).json({ error: error.msg })
    }
}