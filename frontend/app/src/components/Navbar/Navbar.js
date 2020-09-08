

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Logout from '../auth/Logout/Logout';
import { auth, authEmitter } from '../../utils/auth/auth';

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            auth: false,
        }
    }

    componentDidMount() {
        // detect if user was logged in or logged out 
        authEmitter.on('login',
            this.handleLogin.bind(this)
        )
        authEmitter.on('logout',
            this.handleLogout.bind(this)
        )
    }

    handleLogin() {
        this.setState({ auth: auth.isAuth })
    }
    handleLogout() {
        this.setState({ auth: auth.isAuth })
    }

    render() {
        return (
            <Fragment>

                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className='container'>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarColor03">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <Link className="nav-link" to='/'>Home <span className="sr-only">(current)</span></Link>
                                </li>

                                {this.state.auth ?
                                    <Fragment>
                                        <li className="nav-item">
                                            <Link to='/' className="nav-link" ><Logout logout={this.props.logout} /> </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/todo-menu" className="nav-link" >My Lists</Link>
                                        </li>
                                    </Fragment>

                                    :

                                    <Fragment>
                                        <li className="nav-item">
                                            <Link to='/auth/signup' className="nav-link">Signup</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to='/auth/login' className="nav-link">Login</Link>
                                        </li>
                                    </Fragment>
                                }
                            </ul>
                        </div>
                    </div>
                </nav>
            </Fragment >
        )
    }
}


export default Navbar;