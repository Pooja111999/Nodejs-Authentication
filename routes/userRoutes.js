const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController.js');
const checkUserAuth = require('../middlewares/auth-middleware.js');

//routes level middleware
router.use('/changepassword', checkUserAuth);
router.use('/loggeduser', checkUserAuth) 

//public
router.post('/register',UserController.userRegistration);
router.post('/login',UserController.userLogin);
router.post('/reset-password', UserController.sendUserPasswordResetEmail);
router.post('/reset-password/:id/:token' , UserController.userPasswordReset);


//protected password
router.post('/changepassword',UserController.changeUserPassword);
router.get('/loggeduser', UserController.loggedUser);

module.exports = router;
