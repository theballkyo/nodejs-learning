var express = require('express');
var router = express.Router();
var models = require('../models');
/* GET home page. */
router.get('/', function(req, res, next) {
  models.User.findAll().then(function(users) {
    res.render('index', { 
        title: 'Express',
        users: users
    });
    console.log(users);
  })
});

module.exports = router;
