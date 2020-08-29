import React, { Component } from 'react';
import axios from 'axios';


class TodoList extends Component {
    state = {
        tasks: [],
    }
    componentDidMount() {
        this.getList();
    }
    getList() {
        const id = this.props.match.params.id
        axios.get('/todo-list', { params: { listId: id } })
            .then(res => {
                this.setState({
                    title: res.data.title,
                    tasks: res.data.tasks || [],
                    createdAt: res.data.createdAt
                })
            })
            .catch(err => console.log(err))
    }

    handleAddItem(e) {
        e.preventDefault();

        //get item name
        const inputs = Array.from(e.target.children);
        const taskTitle = inputs.find(input => input.name === 'addTodoItem').value;

        const data = {
            taskTitle: taskTitle,
            todoListId: this.props.match.params.id
        }
        // send request 
        axios.post('/add-todo-item', data)
            .then(res => {
                if (res.status !== 201) return console.log('Something went wrong.', res.status);
                console.log('Item was added');
                this.setState({
                    tasks: res.data
                })
                console.log(this.state.tasks)

                // reset input 
                inputs.find(input => input.name === 'addTodoItem').value = '';
                return;
            })
            .catch(err => console.log(err));
    }

    handleRemoveItem(e) {
        e.preventDefault();

        const itemId = Array.from(e.target.children)
            .find(node => node.name === "removeItem")
            .value;

        axios.post('/todo-item-remove', { itemId: itemId })
            .then(res => {
                if (res.status !== 200) return console.log('Something went wrong.', res.status);
                const newTaskList = this.state.tasks.filter(task => task['_id'] !== itemId);
                this.setState({ tasks: newTaskList })
            })
            .catch(err => console.log(err));
    }


    render() {

        return (
            <div className="card mb-3">
                <h3 className="card-header">{this.state.title}</h3>

                <ul className="list-group list-group-flush">
                    <li className="list-group-item" >
                        <form onSubmit={this.handleAddItem.bind(this)} >
                            <input type="text" name="addTodoItem" placeholder="add item" />
                            <button type="submit" >add</button>
                        </form>
                    </li>
                    {this.state.tasks.map(task =>
                        <li className="list-group-item">
                            <span>{task.taskTitle}</span>
                            <span>
                                <form onSubmit={this.handleRemoveItem.bind(this)} >
                                    <input type="text" name="removeItem" value={task['_id']} hidden />
                                    <button type="submit" >remove</button>
                                </form>
                            </span>
                        </li>)}


                </ul>
                <div className="card-footer text-muted">
                    {this.state.createdAt}
                </div>
            </div >

        )
    }
}

export default TodoList;