
const authenticateToken = '../../myUtils/authUtils/authenticateToken';

module.exports = function (app) {
    app.get('/restricted', authenticateToken, (req, res) => {
        const user = req.user; // created in authenticateToken
        res.status(200).json({
            ...user,
            message: "this is restricted"
        })
    })
}
