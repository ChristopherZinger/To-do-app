const { Router } = require('express');
const controllers = require('../controllers/AuthController');


const router = Router();



router.post('/login', controllers.login);
router.post('/signup', controllers.signup);
router.post('/logout', controllers.logout);

module.exports = router;