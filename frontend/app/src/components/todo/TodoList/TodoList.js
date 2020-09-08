import React, { Component } from 'react';
import axios from 'axios';
import styles from './styles/TodoList.module.css';
import { authEmitter } from '../../../utils/auth/auth';

class TodoList extends Component {
    state = {
        tasks: [],
    }
    componentDidMount() {
        // get list when access token is updated
        authEmitter.on('login', () => { this.getList(); })
        // get list on mount
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
                const { task } = res.data;
                const tasks = [task, ...this.state.tasks]
                this.setState({ tasks })

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

        axios.post('/todo-item-remove', { itemId })
            .then(res => {
                if (res.status !== 200) return console.log('Something went wrong.', res.status);
                const newTaskList = this.state.tasks.filter(task => task['_id'] !== itemId);
                this.setState({ tasks: newTaskList })
            })
            .catch(err => console.log(err));
    }

    handleToggleStatus(e) {
        e.preventDefault();

        const itemId = Array.from(e.target.children)
            .find(node => node.name === 'toggleStatus')
            .value;

        axios.post('/todo-item-toggle-status', { itemId })
            .then(res => {
                if (res.status !== 200) return console.log('Something went wrong.', res.status);
                const tasksUpdated = this.state.tasks.map(task => {
                    return task['_id'] === itemId ? { ...task, status: !task.status } : task
                })
                this.setState({ tasks: tasksUpdated })
            })
            .catch(err => console.log(err))
    }


    render() {
        return (
            <div className="card mb-3">
                <h3 className="card-header">{this.state.title}</h3>

                <ul className="list-group list-group-flush">
                    <li className={"list-group-item " + styles.liAddItem} >
                        <form onSubmit={this.handleAddItem.bind(this)} className={styles.addItemForm}>
                            <input type="text" name="addTodoItem" placeholder="add item" className={styles.addItemInput} />
                            <button type="submit" className={styles.addItemBtn} >add</button>
                        </form>
                    </li>
                    {this.state.tasks.map((task, id) =>
                        <li
                            key={id}
                            className={"list-group-item " +
                                styles.listItem + " " +
                                (task.status ? styles.taskCompleted : null)
                            } >

                            <div>{task.taskTitle}</div>
                            <div className={styles.itemOptionsWrapper}>
                                <div>
                                    <form onSubmit={this.handleToggleStatus.bind(this)} >
                                        <input type="text" name="toggleStatus" readOnly value={task['_id']} hidden />
                                        <button type="submit" >
                                            <span className={task.status ? styles.green : styles.gray}>
                                                {task.status ? "done" : "pending"}
                                            </span>
                                        </button>
                                    </form>
                                </div>
                                <div>
                                    <form onSubmit={this.handleRemoveItem.bind(this)} >
                                        <input type="text" name="removeItem" readOnly value={task['_id']} hidden />
                                        <button type="submit" >remove</button>
                                    </form>
                                </div>
                            </div>
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