'use strict';
module.exports = function(sequelize, DataTypes) {
  var Finance = sequelize.define('Finance', {
    title: DataTypes.STRING,
    price: DataTypes.FLOAT,
    type: DataTypes.FLOAT,
    date: DataTypes.DATE,
    notes: DataTypes.TEXT,
  }, {
    classMethods: {
      associate: function(models) {
        Finance.belongsTo(models.User);
        // ListItems.hasMany(models.ListItemsSub);
      }
    },
    underscored: true,
    // tableName: "list_items",
  });
  return Finance;
};