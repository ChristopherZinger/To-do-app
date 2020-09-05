
import React, { useState } from 'react';
import axios from 'axios';
import * as EmailValidator from "email-validator";


const Signup = (props) => {
    // state
    const [passwordConfirmErrors, setPasswordConfirmErrors] = useState('');
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

            // validate password - repeated correctly
            if (inputs.password !== inputs.passwordConfirm) {
                setPasswordConfirmErrors("Type the same password twice.");
                return false;
            }
            return true; // inputs are valid
        }
    }

    function resetErrors() {
        setEmailErrors('');
        setPasswordErrors('');
        setPasswordConfirmErrors('');
    }

    function handleSignupSubmit(e) {
        // stop submit
        e.preventDefault();

        // reset error messages
        resetErrors()

        // get values from input
        const email = e.target.email.value;
        const password = e.target.password.value;
        const passwordConfirm = e.target.passwordConfirm.value;

        // handle wrong inputs
        const inputsAreValid = handleErrors(undefined, { email, password, passwordConfirm })
        if (!inputsAreValid) return;

        // setup data and headers for axios call
        const data = {
            "email": email,
            "password": password
        }

        // call api
        axios.post('/signup', data, { withCredentials: true })
            .then(res => {
                if (res.status === 201) {
                    props.history.push({ pathname: "/" }) // redirect to home
                    return console.log('Sign up success : ');
                }
                else { return console.log('Something went worng. ', res.status) }
            })
            .catch(err => {
                const errors = err.response.data.errors;
                handleErrors(errors);
            })
    };

    return (
        <div>
            <h4>Signup</h4>
            <form onSubmit={handleSignupSubmit}>
                <label htmlFor="emailInput">email</label>
                <input
                    className="form-control"
                    type="text" name="email"
                    id="emailInput" />
                <small id="emailHelp" class="form-text text-muted">
                    {emailErrors ? emailErrors : ''}
                </small>

                <label htmlFor="password">Password</label>
                <input
                    className="form-control"
                    type="password"
                    name="password"
                    id="password" />
                <small id="emailHelp" class="form-text text-muted">
                    {passwordErrors ? passwordErrors : ''}
                </small>

                <label htmlFor="passwordConfirm">Confirm Password</label>
                <input
                    className="form-control"
                    type="password"
                    name="passwordConfirm"
                    id="passwordConfirm" />
                <small id="emailHelp" class="form-text text-muted">
                    {passwordConfirmErrors ? passwordConfirmErrors : ''}
                </small>
                <br />

                <button
                    type="submit"
                    id="signupSubmitBtn"
                    className="btn btn-primary">
                    Sign up
                </button>

            </form>
        </div>
    )
};


export default Signup;