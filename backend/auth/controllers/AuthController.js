const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/AuthModels');

const expirationPeriod = 4;


function generateToken(id, SecretKey, expirationTime) {
    const settings = expirationTime ? { expiresIn: expirationTime + 'm' } : null;
    return jwt.sign(
        { id },
        SecretKey,
        settings,
    )
}

function generateAccessToken(id) {
    return generateToken(id, process.env.ACCESS_TOKEN_SECRET, expirationPeriod)
}

function generateRefreshToken(id) {
    return generateToken(id, process.env.REFRESH_TOKEN_SECRET)
}

function handleErrors(err) {
    console.log('[AuthController.js] handleErrors : ', err.message, err.code);
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

async function loginWithTokens(userId, res) {
    // generate set of tokens
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // set cookie for updating access token
    res.cookie(
        'refreshToken',
        refreshToken,
        {
            httpOnly: true,
            path: '/update-access-token'
        })
    // set cookie for geting new token
    res.cookie(
        'refreshToken',
        refreshToken,
        {
            httpOnly: true,
            path: '/get-new-access-token'
        }
    )

    return accessToken;
}

module.exports.login = async function (req, res) {
    const { email, password } = req.body;

    try {
        const user = await UserModel.login(email, password)
        const accessToken = await loginWithTokens(user._id, res)

        // send accessToken as json
        return res.status(200).json({
            user: { email: user._doc.email },
            auth: { accessToken, expirationPeriod }
        });

    } catch (err) {
        console.log('[AuthController.js] function login, error: ', err)
        const errors = handleErrors(err);
        res.status(errors.code).json({ errors });
    }
}

module.exports.signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (user) throw Error('This Email is already registered.')

        // create new user but not save yet
        const newUser = new UserModel({ email, password });

        const accessToken = await loginWithTokens(newUser._id, res)

        newUser.save(); // save user after all executed correctly
        return res.status(201).json({
            user: { email: newUser._doc.email },
            auth: { accessToken, expirationPeriod }
        });

    } catch (err) {
        const errors = handleErrors(err);
        res.status(errors.code).json({ errors });
    }
}

module.exports.logout = (req, res) => {
    res.cookie(
        'refreshToken',
        '',
        {
            httpOnly: true,
            maxAge: 1,
            path: '/update-access-token'
        }
    );
    res.cookie(
        'refreshToken',
        '',
        {
            httpOnly: true,
            maxAge: 1,
            path: '/get-new-access-token'
        }
    )
    res.sendStatus(200);
}


module.exports.updateAccessToken = (req, res) => {
    /* 
        sends new accessToken
        if the old one is about to expired and
        user provides both refresh token and access token
    
    */
    const accessToken = req.headers
        .authorization.split(' ')[1];

    const { refreshToken } = req.cookies;

    // console.log(
    //     'accessToken: \n',
    //     accessToken, '\n',
    //     'refreshToken: \n',
    //     refreshToken
    // )

    if (accessToken && refreshToken) {
        jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
            (err, data) => {
                if (err) {
                    res.sendStatus(401);
                } else {
                    console.log('sending back new token. \n')
                    const newAccessToken = generateAccessToken(data.id)
                    res.status(200).json({
                        auth: {
                            accessToken: newAccessToken,
                            expirationPeriod: expirationPeriod
                        }
                    });
                }
            })
    } else {
        res.sendStatus(401);
    }
}


module.exports.getNewAccessToken = (req, res) => {
    /* 
        send access token if user only have refresh token
    */
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, data) => {
            if (err) return res.sendStatus(401)

            const { id } = data;
            if (!id) return res.sendStatus(401);

            const user = await UserModel.findById(id)
            if (!user) return res.sendStatus(401);

            const accessToken = generateAccessToken(user._id);
            res.status(200).json({ auth: { accessToken, expirationPeriod } })
        }
    )
}
