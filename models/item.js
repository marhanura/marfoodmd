"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.belongsTo(models.Category);
    }

    static search(menu) {
      let option = {
        where: {},
      };
      if (menu) {
        option.where.name = {
          [Op.iLike]: `%${menu}%`,
        };
      }
      return Item.findAll(option);
    }
  }
  Item.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.INTEGER,
      imgUrl: DataTypes.STRING,
      CategoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Item",
    }
  );
  return Item;
};
