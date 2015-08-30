'use strict';
module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define('Group', {
    title: DataTypes.STRING,
    permission: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        Group.belongsTo(models.User);
      }
    },
    underscored: true,
  });
  return Group;
};