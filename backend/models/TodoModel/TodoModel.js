const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Todo Model
let Todo = new Schema({
    taskTitle: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const TodoModel = mongoose.model("Todo", Todo);

let TodoLists = new Schema({
    title: {
        type: String,
        required: true,
        default: "My List"
    },
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: "tasks"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const TodoListsModel = mongoose.model("TodoLists", TodoLists);

// export models
module.exports.TodoModel = TodoModel;
