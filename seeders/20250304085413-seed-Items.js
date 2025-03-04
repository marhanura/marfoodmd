"use strict";
const fs = require("fs").promises;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = JSON.parse(await fs.readFile("./data/items.json", "utf8")).map(
      (el) => {
        delete el.id;
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      }
    );
    await queryInterface.bulkInsert("Items", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Items", null, {});
  },
};
