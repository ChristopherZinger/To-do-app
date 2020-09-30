import React from 'react';
import * as EmailValidator from "email-validator";
import axios from 'axios';
import styles from './AuthForm.module.css';


export default class AuthForm extends React.Component {
    constructor(props) {
        super(props)

        // create default values for inputs
        const inputs = {};
        this.props.inputs.forEach(inputField => {
            inputs[inputField.input.name] = {
                value: '',
                isValid: false,
                touched: false,
                message: []
            }
        });

        this.state = { ...inputs };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.emailIsValid = this.emailIsValid.bind(this);
        this.passwordIsValid = this.passwordIsValid.bind(this);
        this.handleBlur = this.handleBlur.bind(this)
    }

    inputIsValid({ name, value }) {

        // value => {email: "something"}
        if (name === 'email') return this.emailIsValid(value);

        // value => {password: "something", passwordConfirm: "something"}
        if (name === 'password') return this.passwordIsValid(value);

        if (name === 'passwordConfirm') return this.passwordConfirmIsValid(value);

        return null;
    }

    emailIsValid(value) {
        const isValid = EmailValidator.validate(value)
            ? true : false;
        const message = isValid ? '' : ['This email is not valid.',]
        return { isValid, message };
    }

    passwordIsValid(password) {
        const message = [];
        const consfirmPassword = this.state.passwordConfirm.value;
        let isValid = true;

        // password length
        if (password.length < 6) {
            message.push('Password is too short. Must be at least 6 characters.')
            isValid = false
        }

        // check if password is repeated correctly
        (function (self) {
            const isValid = password === consfirmPassword;
            const message = isValid ? [] : ['Type the same password twice.'];
            self.setState({
                passwordConfirm: {
                    ...self.state.passwordConfirm,
                    isValid: false,
                    message: ['Type the same password twice.']
                }
            })
        })(this)

        return { isValid, message };
    }

    passwordConfirmIsValid(passwordConfirm) {
        const message = [];
        let isValid = true;
        const password = this.state.password.value;

        // compare passwords
        if (password !== passwordConfirm) {
            isValid = false;
            message.push('Type the same password twice.')
        }
        return { isValid, message };
    }

    handleInputChange({ target }) {
        const inputName = target.name;
        const inputValue = target.value;
        const { isValid, message } = this.inputIsValid(target)

        this.setState({
            [inputName]: {
                ...this.state[inputName],
                value: inputValue,
                isValid,
                message
            }
        });
    }

    handleSubmit(e) {
        // return if loading and set submit btn style

        // prevent default
        e.preventDefault();
        const { target } = e;

        // data to be sent
        const { email, password } = this.state;
        const data = {
            email: email.value,
            password: password.value
        }

        // url 
        const url = this.props.submit.url;

        // call API
        axios.post(url, data)
            .then(res => {
                const data = res.data.auth;
                // reset btn style

                // login or signup
                this.props.submit.success(data);

                // redirect
                // props.history.push({ pathname: "/" })
                return;
            })
            .catch(err => {

                // update btn style 


                //handle errors
                this.props.submit.error();

            })
    }

    handleBlur({ target }) {
        this.setState({
            [target.name]: {
                ...this.state[target.name],
                touched: true
            }
        })
    }

    render() {

        const inputFields = this.props.inputs.map((inputField, i) => {
            // add handling change method
            inputField.input.onChange = this.handleInputChange;
            inputField.input.onBlur = this.handleBlur;

            return (
                <MyInput
                    key={i}
                    value={this.state[inputField.input.name]}
                    message={this.state[inputField.input.name].message}
                    {...inputField} {...this.state[inputField.input.name]}
                />
            )
        })

        return (
            <form onSubmit={this.handleSubmit} className={styles.authform}>
                {this.props.children}
                {inputFields}
                <button type="submit" >{this.props.submit.txt || 'Go!'}</button>
            </form>
        )
    }
}


const MyInput = props => {
    const touched = props.touched
    return (
        <div>
            <label htmlFor={props.input.id}>{props.label.txt}</label>
            <br />
            <input type={props.input.type} name={props.input.name}
                className={[...props.input.classes].join(' ')} id={props.input.id}
                placeholder={props.input.placeholder} onChange={props.input.onChange}
                value={props.input.value} onBlur={props.input.onBlur}
            />

            <small id={props.info.id} className={[...props.info.classes].join(' ')}>
                {touched ? props.message : ""}
            </small>
        </div>
    )
}


