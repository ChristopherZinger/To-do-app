

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Logout from '../auth/Logout/Logout';


class Navbar extends Component {
    state = {

    }

    componentDidMount() {

    }


    handleLogin() {
        this.setState({ isAuth: true });
    }

    render() {

        return (
            <Fragment>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarColor03">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <Link className="nav-link" to='/'>Home <span className="sr-only">(current)</span></Link>
                            </li>

                            {
                                this.props.isAuth ?
                                    <li className="nav-item">
                                        <Link to='/' className="nav-link" ><Logout logout={this.props.logout} /> </Link>
                                    </li>
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





                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Todo Menu</a>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="#">Create New List</a>
                                    <div className="dropdown-divider"></div>
                                    <Link to="/todo-menu" className="dropdown-item">Todo All Lists</Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
            </Fragment >
        )
    }
}


export default Navbar;