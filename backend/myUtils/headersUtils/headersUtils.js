

module.exports = (req, res, next) => {
    // console.log('headers')
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Credentials', true);
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
}