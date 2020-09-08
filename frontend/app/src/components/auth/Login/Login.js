import React, { useState } from 'react';
import axios from 'axios';
import * as EmailValidator from "email-validator";
import { auth } from '../../../utils/auth/auth';




function Login(props) {

    // state
    const [passwordErrors, setPasswordErrors] = useState('');
    const [emailErrors, setEmailErrors] = useState('');

    function handleErrors(errors, inputs) {
        if (errors) {
            // password errors - backend errors
            if (errors.password !== undefined) {
                setPasswordErrors(errors.password)
                return;
            }

            // email password - backend errors
            if (typeof errors.email !== undefined) {
                setEmailErrors(errors.email)
                return;
            }
        }

        if (inputs) {
            // validate email on frontend
            if (!EmailValidator.validate(inputs.email)) {
                setEmailErrors("This email is invalid.");
                return false;
            };

            // validate password - length
            if (typeof inputs.password !== 'string' || inputs.password.length < 4) {
                console.log('too short')
                setPasswordErrors('This password is too short. It has to include more than 4 characters.');
                return false;
            }
            return true; // inputs are valid
        }
    }

    function resetErrors() {
        setEmailErrors('');
        setPasswordErrors('');
    }

    function handleLoginSubmit(e) {
        // stop submit
        e.preventDefault();

        // reset errors
        resetErrors()

        // get values from input
        const email = e.target.email.value;
        const password = e.target.password.value;

        // validate inputs
        const inputsAreValid = handleErrors(undefined, { email, password })
        if (!inputsAreValid) return;

        // setup data and headers for axios call
        const data = {
            "email": email,
            "password": password
        }

        // call api
        axios.post('/login', data)
            .then(res => {

                console.log('Login Success.', res.data.user)
                // save accessToken as variable
                const { accessToken, expirationPeriod } = res.data.auth;
                auth.login(accessToken, expirationPeriod); // from utils/auth/auth

                // redirect to 
                props.history.push({ pathname: "/" })
                return;
            })
            .catch(err => {
                console.log(err)
                if (err.response && err.response.data) {
                    const errors = err.response.data.errors;
                    handleErrors(errors);
                }
                handleErrors(err);
            })
    };


    return (
        <div>
            <h4>Login</h4>
            <br />
            <form onSubmit={handleLoginSubmit.bind(this)}>
                <label htmlFor="InputEmail">Email address</label>
                <input type="email" name="email" className="form-control" id="InputEmail" aria-describedby="emailHelp" placeholder="Enter email" />
                <small id="emailHelp" className="form-text text-muted">
                    {emailErrors ? emailErrors : ''}
                </small>

                <br /><br />
                <label htmlFor="exampleInputPassword1">Password</label>
                <input type="password" name="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                <small id="emailHelp" className="form-text text-muted">
                    {passwordErrors ? passwordErrors : ''}
                </small>
                <br /><br />

                <button type="submit" id="handleLoginSubmit" className="btn btn-primary">Login</button>


            </form>
        </div>
    )

};



export default Login;

