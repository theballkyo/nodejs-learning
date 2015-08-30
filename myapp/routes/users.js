var express = require('express');
var router = express.Router();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var models = require('../models');

var data = {};

passport.use('login', new LocalStrategy({
    passReqToCallback : true,
    usernameField: 'email',
    passwordField: 'password',
  },
  function(req, username, password, done) { 
    if (req.isAuthenticated())
      return done(null, req.user);
    // check in mongo if a user with username exists or not
    models.User.findOne({ where: { 'email' :  username } }).then(
      function(user) {
        console.log('User:', user);
        // Username does not exist, log error & redirect back
        if (user === null) {
          console.log('Error !?');
          return done(null, false);
        }
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false, 
                {'message': 'User Not found.'});                 
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, 
               {'message': 'Invalid Password'});
        }
        // User exists but wrong password, log the error 
        // if (!isValidPassword(user, password)){
        //   console.log('Invalid Password');
        //   return done(null, false, 
        //       req.flash('message', 'Invalid Password'));
        // }
        // User and password both match, return user from 
        // done method which will be treated like success
        console.log('Ok');
        return done(null, user);
      }
    );
}));

router.use(function (req, res, next) {
  res.locals.message = req.flash('message');
  data.date = Date.now();
  next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('user/login', { message: req.flash('error') });
});

router.get('/create', function(req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('./');
  res.redirect('/');
  // res.render('user/create');
});

router.post('/login',
  passport.authenticate('login', { 
    successRedirect: './',
    failureRedirect: './login',
    failureFlash: true 
  })
);

router.post('/create', function(req, res, next) {
  console.log('Data:', data);
  res.append('test', 'abc');
  res.render('user/create');
});
module.exports = router;
