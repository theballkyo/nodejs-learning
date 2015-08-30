'use strict';
module.exports = function(sequelize, DataTypes) {
  var ListItemsSub = sequelize.define('ListItemsSub', {
    title: DataTypes.STRING,
    price: DataTypes.FLOAT.UNSIGNED.ZEROFILL,
    img: DataTypes.STRING,
    date: DataTypes.DATE,
    notes: DataTypes.TEXT,
  }, {
    classMethods: {
      associate: function(models) {
        ListItemsSub.belongsTo(models.ListItems);
        // ListItems.hasMany(models.ListItemsSub);
      }
    },
    underscored: true,
    tableName: "list_items_sub",
  });
  return ListItemsSub;
};