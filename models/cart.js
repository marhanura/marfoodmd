'use strict';
const {
  Model
} = require('sequelize');
const cartitem = require('./cartitem');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.User)
      Cart.belongsToMany(models.Item, {through: models.CartItem})
    }
  }
  Cart.init({
    ItemId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};