import React, { Component } from 'react';
import axios from 'axios';
import getCookie from '../../../utils/cookies/getCookie';



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
                if (res.status === 200) {
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