import React, { Component } from 'react';
import axios from 'axios';
import getCookie from '../../../utils/cookies/getCookie';
import Cookies from 'js-cookie';


class Logout extends Component {
    handleLogout() {
        // data
        const data = {
            'accessToken': getCookie('accessToken'),
            'refreshToken': getCookie('refreshToken')
        };

        // if (data.refreshToken === '') return console.log('You are not authenticated right now.')
        // call logout 
        axios.post('/logout', data, { withCredentials: true })
            .then(res => {
                console.log('in logout status', res.status)
                if (res.status === 200) {
                    console.log('in logout 200')
                    // haange state 
                    // this.props.logout();

                    // // remove cookies 
                    // Cookies.set('accessToken', '', { path: '' });
                    // Cookies.set('refreshToken', '', { path: '' });

                    // delete token from headers globaly
                    // axios.defaults.headers.common['authorization'] = `AUTH TOKEN`;
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