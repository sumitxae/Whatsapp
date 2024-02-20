var express = require('express');
var router = express.Router();
const { render } = require('ejs');
const {uploadGroupDPs, uploadUserDPs} = require('./multer');
const { ConnectionStates } = require('mongoose');
const contollers = require('../controllers/controls');



/* GET Register page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', contollers.registerUser);

router.post('/login', contollers.loginUser);

router.get('/home', isLoggedIn, contollers.renderHomePage);

router.post('/create/groupId', isLoggedIn, uploadGroupDPs.single('groupImage'), contollers.createGroup);

router.post('/change/profile', isLoggedIn, uploadUserDPs.single('userImage'), contollers.editProfile);

router.get('/logout', contollers.logoutUser);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = router;