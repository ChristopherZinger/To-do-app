
import React, { Fragment, useState } from 'react';
import AuthForm from '../AuthForm/AuthForm';
import { auth } from '../../../utils/auth/auth';

export default class SignupForm extends React.Component {
    render() {
        const inputs = []

        // add email field
        inputs.push({
            input: {
                id: "email",
                name: "email",
                type: "email",
                placeholder: "Email",
                classes: [],
            },
            label: {
                txt: "Email"
            },
            info: {
                classes: []
            }
        })

        // add password field
        inputs.push({
            input: {
                id: "password",
                name: "password",
                type: "password",
                placeholder: "Password",
                classes: [],
            },
            label: {
                txt: "Password"
            },
            info: {
                classes: []
            }
        })

        // add password confirmation field
        inputs.push({
            input: {
                id: "passwordConfirm",
                name: "passwordConfirm",
                type: "password",
                placeholder: "Confirm Password",
                classes: [],
            },
            label: {
                txt: "Confirm Password"
            },
            info: {
                classes: []
            }
        })

        const submit = {
            txt: 'submit',
            url: '/login',
            success: (data) => {
                // save accessToken as variable
                const { accessToken, expirationPeriod } = data;
                auth.login(accessToken, expirationPeriod); // from utils/auth/auth
            },
            error: () => {
                console.log('error while submiting login form')
            }
        }

        return (
            <AuthForm
                submit={submit}
                inputs={inputs}
            >
                <h4>Signup</h4>
                <p>Welcome to Todo app. Create new accout with your email.</p>
            </AuthForm>
        )
    }
}
