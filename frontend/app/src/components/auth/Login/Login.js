import React, { Component } from 'react';
import axios from 'axios';
import * as EmailValidator from "email-validator";
import Cookies from 'js-cookie';

class Login extends Component {

    handleLoginSubmit(e) {
        // stop submit
        e.preventDefault();

        // get values from input
        const inputs = Array.from(e.target.children)
        const email = inputs.find(node => node.name === "email").value
        const password = inputs.find(node => node.name === "password").value

        // validate email
        if (!EmailValidator.validate(email)) return console.log('wrong email');
        // validate password
        if (typeof password !== 'string'
            || password.length < 4) return console.log('password to short')

        // setup data and headers for axios call
        const data = {
            "email": email,
            "password": password
        }

        // call api
        axios.post('/login', data)
            .then(res => {
                // set token in cookies
                Cookies.set('accessToken', res.data.accessToken, { path: '' });
                Cookies.set('refreshToken', res.data.refreshToken, { path: '' });
                // document.cookie = `accessToken=${res.data.accessToken}; path=/`
                // document.cookie = ` refreshToken=${res.data.refreshToken}; path=/`
                // set token in headers globaly
                axios.defaults.headers.common['authorization'] = `AUTH ${res.data.accessToken}`;
                console.log('Login Success.')
                this.props.history.push({ pathname: "/" }) // redirect to /
            })
            .catch(err => console.log(err))
    };

    render() {
        return (
            <div>
                <h4>Login</h4>
                <form onSubmit={this.handleLoginSubmit.bind(this)}>
                    <label htmlFor="InputEmail">Email address</label>
                    <input type="email" name="email" className="form-control" id="InputEmail" aria-describedby="emailHelp" placeholder="Enter email" />

                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" name="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />

                    <br />
                    <button type="submit" id="handleLoginSubmit" className="btn btn-primary">Login</button>
                </form>
            </div>
        )
    }
};






export default Login;