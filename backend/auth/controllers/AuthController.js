const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/AuthModels');



function generateAccessToken(id) {
    return jwt.sign(
        { id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '5m' }
    )
}
const maxAge = 3 * 24 * 60 * 60;


function handleErrors(err) {
    console.log(err.message, err.code);
    let errors = { email: '', password: '', code: null };

    // incorrect email -> errors in User.login
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
        errors.code = 400;
        return errors;
    }

    // incorrect password -> errors in User.login
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
        errors.code = 401;
        return errors;
    }

    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        errors.code = 409;
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
        errors.code = 400;
        return errors;
    }

    // else
    errors.code = 500;
    return errors;
}


module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.login(email, password)
        const token = generateAccessToken(user._id);
        res.cookie(
            'token',
            token,
            { httpOnly: true, maxAge: maxAge * 1000 }
        );
        return res.status(200).json(user);
    } catch (err) {
        const errors = handleErrors(err);
        res.status(errors.code).json({ errors });
    }
}

module.exports.signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (user) throw Error('This Email is already registered.')

        const newUser = new UserModel({ email, password });
        newUser.save();

        const token = generateAccessToken(newUser._id);
        res.cookie(
            'token',
            token,
            { httpOnly: true, maxAge: maxAge * 1000 }
        );
        return res.status(201).json(newUser);

    } catch (err) {
        const errors = handleErrors(err);
        res.status(errors.code).json({ errors });
    }
}


module.exports.logout = (req, res) => {
    res.cookie('token', '', { maxAge: 1 });
    res.sendStatus(200);
}