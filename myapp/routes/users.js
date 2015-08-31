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

    models.User.findOne({ where: { 'email' :  username } }).then(
      function(user) {
        console.log('User:', user);
        // Username does not exist, log error & redirect back
        if (user === null) {
          console.log('User Not Found with username '+username);
          return done(null, false, 
                {'message': 'User Not found.'});   
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

        console.log('Ok');
        return done(null, user);
      }
    );
}));

router.use(function(req, res, next) {
  res.locals.success = true;
  if (!req.user && req.path !== '/login')
    //return res.redirect('./login');
    next();
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('user/index');
});

router.get('/login', function(req, res, next) {
  res.render('user/login', { message: req.flash('error') });
});

router.get('/create', function(req, res, next) {
  //if (!req.isAuthenticated())
  //  return res.redirect('./');
  //res.redirect('/');
  res.render('user/create');
});

router.post('/login',
  passport.authenticate('login', { 
    successRedirect: './',
    failureRedirect: './',
    failureFlash: true 
  })
);

router.post('/create', function(req, res, next) {
  console.log(req.body);
  // Table created
  models.User
  .build({
    username: '',
    password: '111',
    email: 'localhost1@aaa',
    is_admin: false,
    group: -1,
  })
  .save()
  .then(function(user){
    data = {'success': true, 'user': user};
  })
  .catch(function(errors) {
    console.log(errors);
    var e = []
    errors.errors.forEach(function(name) {
      console.log(name.path);
      e.push([name.path, name.message]);
    })
    data = {'success': false, errors: e};
  });
  res.render('user/create', data);
});
module.exports = router;
