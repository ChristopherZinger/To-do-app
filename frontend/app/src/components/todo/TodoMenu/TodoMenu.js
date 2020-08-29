import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import TodoListOfLists from '../TodoList/TodoListOfLists';
import TodoList from '../TodoList/TodoList';

class TodoMenu extends Component {


    hasToken() {
        // const cookies = document.cookie;
        // console.log('[TodoMenu.js] cookies :', cookies)
    }

    fethTodoListOfLists() {
        axios.get('/todo-list-of-lists')
            .then(res => console.log(res.data))
            .catch(err => {
                // if (res.status === 403) this.props.history.push('/')
                console.log(err)
            })
    }

    componentDidMount() {
        // this.hasToken();
        // this.fethTodoListOfLists();
    }

    render() {
        return (

            < div >
                {!this.props.isAuth ? <Redirect to='/auth/login' /> : null}
                <Fragment>
                    <div className="row" >
                        <div className="col-4" >
                            <div>
                                <h4>List of lists</h4>
                                <Route path={this.props.match.url} component={TodoListOfLists} />
                            </div>
                        </div>
                        <div className="col-8" >
                            <div>
                                <h4>Todo list to edit</h4>
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