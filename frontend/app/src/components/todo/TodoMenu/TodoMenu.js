import React, { Component, Fragment } from 'react';
// import axios from 'axios';
import { Redirect, Route } from 'react-router-dom';
import TodoListOfLists from '../TodoList/TodoListOfLists';
import TodoList from '../TodoList/TodoList';
// import styles from './styles/TodoMenu.module.css';



class TodoMenu extends Component {
    render() {
        return (
            < div >
                <Fragment>
                    <div className="row" >
                        <div className="col-4" >
                            <div>
                                <p className='lead'>List of lists</p>
                                <Route path={this.props.match.url} component={TodoListOfLists} />
                            </div>
                        </div>
                        <div className="col-8" >
                            <div>
                                <p className='lead'>Todo list to edit</p>
                                <Route
                                    path={this.props.match.url + '/:id'}
                                    exact
                                    component={(p) => <TodoList {...p} />}
                                />
                            </div>
                        </div>
                    </div>
                </Fragment>
            </div >
        )
    }
}



export default TodoMenu;