const { Router } = require('express');
const controllers = require('../controllers/AuthController');


const router = Router();



router.post('/login', controllers.login);
router.post('/signup', controllers.signup);
router.post('/logout', controllers.logout);
router.get('/update-access-token', controllers.updateAccessToken);
router.get('/get-new-access-token', controllers.getNewAccessToken);

module.exports = router;