const { Router } = require('express');
const controllers = require('../controllers/AuthController');


const router = Router();



router.post('/logint', controllers.login);
router.post('/signup', controllers.signup);
router.post('/logout', controllers.signup);




module.exports = router;