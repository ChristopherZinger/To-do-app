const { UserModel } = require('../../auth/models/AuthModels');
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, decodedToken) => {
                if (err) {
                    res.user = null;
                    next();
                } else {
                    const user = await UserModel.findById(decodedToken.id);
                    res.user = user;
                    next();
                }
            })
    } else {
        res.user = null;
        next();
    }

}