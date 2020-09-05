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
        console.log(err)
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
        console.log(err)
    }
}


module.exports.logout = (req, res) => {
    res.cookie('token', '', { maxAge: 1 });
    res.sendStatus(200);
}