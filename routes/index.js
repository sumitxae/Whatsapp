var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const { render } = require('ejs');
const localStrategy = require('passport-local').Strategy;

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', async function(req, res, next) {
  const user = new userModel({
    username: req.body.username,   // User Model Feilds Here
    contact: req.body.contact,
  })
  userModel.register(user, req.body.password)
  .then(() => {
    passport.authenticate("local") (req, res, () => {
      res.redirect('/home')
    })
  })
});

router.post('/login', passport.authenticate('local',{
  successRedirect: '/home',
  failureRedirect: '/'
}), (req, res, next) => {})

router.get('/home', isLoggedIn, (req , res, next) => {
  res.render("home", {user: req.user})
})

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = router;
