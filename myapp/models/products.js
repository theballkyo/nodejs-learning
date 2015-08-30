'use strict';
module.exports = function(sequelize, DataTypes) {
  var Products = sequelize.define('Products', {
    name: DataTypes.STRING,
    price: DataTypes.FLOAT.UNSIGNED.ZEROFILL,
    retailPrice: DataTypes.FLOAT.UNSIGNED.ZEROFILL,
    describe: DataTypes.TEXT,
    stock: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        Products.belongsTo(models.User);
        Products.hasMany(models.ListItemsSub);
      }
    },
    underscored: true,
    // tableName: "list_items",
  });
  return Products;
};