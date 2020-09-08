import React, { Component } from 'react';
import axios from 'axios';
import getCookie from '../../../utils/cookies/getCookie';
import { auth } from '../../../utils/auth/auth';
import styles from './Login.module.css';


class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnIsActive: true,
        }
    }
    handleLogout() {
        if (!this.state.btnIsActive) return console.log('button is inactive')
        // desactivate btn
        this.setState({ btnIsActive: false })
        // data
        const data = {
            'accessToken': getCookie('accessToken'),
            'refreshToken': getCookie('refreshToken')
        };

        // call logout 
        axios.post('/logout', data, { withCredentials: true })
            .then(res => {
                // activate btn
                this.setState({ btnIsActive: false })
                //logout 
                auth.logout();
                console.log("Logout success.")
            })
            .catch(err => {
                // activate btn
                this.setState({ btnIsActive: false })
                console.log(err)
            })
    }

    render() {
        return (
            <span className={this.state.btnIsActive ? styles.active : styles.inactive} onClick={this.handleLogout.bind(this)}>Logout</span>
        )
    }
}



export default Logout;
