'use strict';
module.exports = function(sequelize, DataTypes) {
  var ListItems = sequelize.define('ListItems', {
    title: DataTypes.STRING,
    price: DataTypes.FLOAT.UNSIGNED.ZEROFILL,
    img: DataTypes.STRING,
    date: DataTypes.DATE,
    notes: DataTypes.TEXT,
  }, {
    classMethods: {
      associate: function(models) {
        ListItems.belongsTo(models.User);
        ListItems.hasMany(models.ListItemsSub);
      }
    },
    underscored: true,
    tableName: "list_items",
  });
  return ListItems;
};