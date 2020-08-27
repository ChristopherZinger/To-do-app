import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';


class TodoMenu extends Component {
    state = {}

    hasToken() {
        const cookies = document.cookie;
        console.log('[TodoMenu.js] cookies :', cookies)
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
        this.hasToken();
        this.fethTodoListOfLists();
    }

    render() {
        return (

            < div >
                {/* {this.props.accessToekn == '' ? <Redirect to="/" /> : null} */}
                <div>
                    <h4>List of lists</h4>
                </div>
                <div>
                    <h4>Todo list to edit</h4>
                </div>
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