var express = require('express');
var router = express.Router();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var models = require('../models');
var underscore = require('underscore');
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
  if (!req.user && req.path !== '/login')
    //return res.redirect('./login');
    return next();
  next();

});

router.use('/create', function(req, res, next) {

  res.locals.errors =  {'errors': [], 'msg': [], 'err': false};
  res.locals.isError = function(path, errors) {
    return underscore.findWhere(errors, {path: path}) !== undefined;
  };
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
  //Validate
  if (req.body.password !== req.body.password2) {
    res.locals.errors.errors.push({'path': 'password', 'message': 'รหัสผ่านต้องเหมือนกันทั้ง 2 ข่อง'});
    res.locals.errors.errors.push({'path': 'password2'});
    res.render('user/create', {'success': false});
  } else {
    models.User
    .build({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      is_admin: false,
      group: req.body.group,
    })
    .save()
    .then(function(user){
      data = {'success': true, 'user': user};
    })
    .catch(function(errors) {
      console.log(errors);
      var e = {'path': [], 'msg': []}
      errors.errors.forEach(function(name) {
        e.path.push(name.path);
        e.msg.push(name.message);
      })
      console.log(e);
      data = {'success': false, 'err': true, 'errors': errors};
    })
    .finally(function(user) {
       res.render('user/create', data);
    });
  }
 
});
module.exports = router;
