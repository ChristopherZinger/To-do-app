const { UserModel } = require('../../auth/models/AuthModels');
const jwt = require('jsonwebtoken');

module.exports.getUser = (req, res, next) => {
    const encodedAccessToken = req.headers.authorization;
    const accessToken = encodedAccessToken.split(' ')[1]

    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decodedAccessToken) => {
            if (err) {
                res.user = null;
                next();
            } else {
                try {
                    const user = await UserModel.findById(decodedAccessToken.id);
                    // console.log('[authUtils.js] function isAuth. user: ', user)
                    res.user = user;
                    next();
                } catch (err) {
                    console.log('[authUtils.js] function isAuth. error: ', err)
                    res.user = null;
                    next();
                }
            }
        }
    )
}



