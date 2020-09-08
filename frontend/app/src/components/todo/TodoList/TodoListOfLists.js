import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './styles/TodoListOfLists.module.css';
import { authEmitter } from '../../../utils/auth/auth';

class TodoListOfLists extends Component {
    constructor(props) {
        super(props)
        this.state = {
            todoListOfLists: []
        }
    }

    componentDidMount() {
        // get items if when access token is updated
        authEmitter.on('login', () => {
            this.updateListOfLists();
        })
        // update list on mount
        this.updateListOfLists();
    }

    async handleAddList(e) {
        e.preventDefault();
        // get value
        const newListTitle = e.target.newListTitle.value;
        if (!newListTitle) return; // return if input is empty

        // reset input
        e.target.newListTitle.value = '';

        try {
            await axios.post('/add-list', { listTitle: newListTitle })
            // update list
            this.updateListOfLists();
        } catch (err) {
            console.log(err)
        }

    }

    updateListOfLists() {
        axios.get('/todo-list-of-lists')
            .then(res => {
                const { listOfIds } = res.data;
                this.setState({ todoListOfLists: listOfIds })
            })
            .catch(err => null);
    }

    handleRemoveList(e) {
        e.preventDefault();
        // get id of list to remove
        const inputId = e.target.inputId.value;

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


