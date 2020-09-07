import React, { Component } from 'react';
import axios from 'axios';
import getCookie from '../../../utils/cookies/getCookie';
import { auth } from '../../../utils/auth/auth';



class Logout extends Component {
    handleLogout() {
        // data
        const data = {
            'accessToken': getCookie('accessToken'),
            'refreshToken': getCookie('refreshToken')
        };

        // call logout 
        axios.post('/logout', data, { withCredentials: true })
            .then(res => {
                if (res.status === 200) {
                    auth.logout();
                    console.log("Logout success.")
                }
            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <span onClick={this.handleLogout.bind(this)}>Logout</span>
        )
    }
}



export default Logout;
