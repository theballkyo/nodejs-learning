'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING(32),
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      },
      unique: true
    },
    is_admin: DataTypes.BOOLEAN,
    group: DataTypes.INTEGER,

  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        User.hasMany(models.Group);
        User.hasMany(models.ListItems);
        User.hasMany(models.Finance);
      }
    },
    underscored: true,
  });

  User.sync().then(function () {
    // Table created
    return User.create({
      username: 'all1',
      password: '0',
      email: 'localhost1@localhost.com',
      is_admin: false,
      group: -1,
    })
  });

  return User;
};