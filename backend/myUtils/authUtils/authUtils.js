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
                console.log('[authUtils.js] getUser. invalid token ')
                next();
            } else {
                try {
                    const user = await UserModel.findById(decodedAccessToken.id);
                    console.log('[authUtils.js] getUser(); user: ', user.email)
                    res.user = user;
                    next();
                } catch (err) {
                    console.log('[authUtils.js] getUser(); ERROR WHILE QUERYING FOR USER. ')
                    res.user = null;
                    next();
                }
            }
        }
    )
}



