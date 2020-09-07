const { Router } = require('express');
const router = Router();
const { TodoModel, TodoListsModel } = require('../models/TodoModel');


module.exports.todoList = async (req, res) => {
    try {
        // const todoListId = req.params
        if (!res.user) throw Error('You need to log in again')

        const { listId } = req.query;
        const list = await TodoListsModel.findById(listId);
        const tasks = await TodoModel.find({ '_id': { $in: list.tasks } });

        const data = {
            title: list.title,
            tasks: tasks,
            createdAt: list.createdAt
        }
        res.status(200).json(data)

    } catch (error) {
        console.log('ERROR', error)
        res.sendStatus(500);
    }
}


module.exports.addTodoItem = async (req, res) => {
    try {
        // const todoListId = req.params
        if (!res.user) throw Error('You need to log in again')
        const { taskTitle, todoListId } = req.body;

        const list = await TodoListsModel.findById(todoListId);
        const task = new TodoModel({ taskTitle })
        await task.save();

        list.tasks.push(task);
        await list.save()

        res.status(201).json({ task })

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

module.exports.removeTodoItem = async (req, res) => {
    try {
        // const todoListId = req.params
        if (!res.user) throw Error('You need to log in again')
        const { itemId } = req.body;

        const task = await TodoModel.findByIdAndDelete(itemId)

        res.sendStatus(200)

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

module.exports.toggleTaskStatus = async (req, res) => {
    try {
        // const todoListId = req.params
        if (!res.user) throw Error('You need to log in again')
        const { itemId } = req.body;

        const task = await TodoModel.findById(itemId);
        task.status = !task.status;
        await task.save();

        res.sendStatus(200)

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}