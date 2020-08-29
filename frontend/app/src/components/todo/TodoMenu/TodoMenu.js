import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import TodoListOfLists from '../TodoList/TodoListOfLists';
import TodoList from '../TodoList/TodoList';
import styles from './styles/TodoMenu.module.css';



class TodoMenu extends Component {


    fethTodoListOfLists() {
        axios.get('/todo-list-of-lists')
            .then(res => console.log(res.data))
            .catch(err => {
                // if (res.status === 403) this.props.history.push('/')
                console.log(err)
            })
    }


    render() {
        return (

            < div >
                {!this.props.isAuth ? <Redirect to='/auth/login' /> : null}
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

const mapStateToProps = state => {
    return {
        accessToken: state.auth.accessToken,
        url: state.apiURL.url
    }
}

export default connect(mapStateToProps)(TodoMenu);