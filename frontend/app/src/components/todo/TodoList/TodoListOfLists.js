import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './styles/TodoListOfLists.module.css';


class TodoListOfLists extends Component {

    state = {
        todoListOfLists: [
        ]
    }

    componentDidMount() {
        this.updateListOfLists();
    }

    handleAddList(e) {
        e.preventDefault();
        // get value
        const inputs = Array.from(e.target.children);
        const newListTitle = inputs.find(node => node.name === "newListTitle").value;

        axios.post('/add-list', { listTitle: newListTitle })
            .then(res => {
                console.log('response', res.data)
                this.updateListOfLists();
                inputs.find(node => node.name === "inputId").value = ''
            })
            .catch(err => console.log(err))
    }

    updateListOfLists() {
        axios.get('/todo-list-of-lists')
            .then(res => {
                this.setState({ todoListOfLists: res.data })
            })
            .catch(err => console.log(err));
    }

    handleRemoveList(e) {
        e.preventDefault();
        // get id of list to remove
        const inputs = Array.from(e.target.children);
        const inputId = inputs.find(node => node.name === "inputId").value;
        // data
        const data = { 'listId': inputId };
        // call remove list
        axios.post('/remove-list', data)
            .then(res => {
                if (res.status === 200) {
                    // download update list
                    this.updateListOfLists()
                } else {
                    console.log(res.status)
                }
            })
            .catch(err => console.log(err))
    }


    render() {
        return (
            <div>
                <div className="card mb-3">
                    <div className="card-footer text-muted">
                        <form onSubmit={this.handleAddList.bind(this)} className={styles.addItemForm}>
                            <input type="text" name="newListTitle" placeholder="Title of new List" />
                            <button
                                className={styles.addListBtn}
                                type="submit" >
                                Add
                        </button>
                        </form>
                    </div>
                    <ul className="list-group list-group-flush">
                        {this.state.todoListOfLists.map((list, id) => {
                            return (
                                <li key={id} className={"list-group-item " + styles.myListItem}>
                                    <div>
                                        <Link to={this.props.match.url + '/' + list['_id']} >{list.title}</Link>
                                    </div>
                                    <div>
                                        <form onSubmit={this.handleRemoveList.bind(this)}>
                                            <input type="text" name="inputId" value={list["_id"]} readOnly hidden />
                                            <button type="submit" >remove</button>
                                        </form>
                                    </div>

                                </li>
                            )
                        }

                        )}

                    </ul>

                </div>
            </div>
        )
    }
}


export default TodoListOfLists;


