"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await Promise.all([
    //   queryInterface.changeColumn("cart_items", "ledcolor", {
    //     type: Sequelize.STRING,
    //     allowNull: true,
    //   }),
    //   queryInterface.changeColumn("cart_items", "bodycolor", {
    //     type: Sequelize.STRING,
    //     allowNull: true,
    //   }),
    //   queryInterface.changeColumn("cart_items", "watts", {
    //     type: Sequelize.DOUBLE,
    //     allowNull: true,
    //   }),
    //   queryInterface.changeColumn("cart_items", "reflectors", {
    //     type: Sequelize.DOUBLE,
    //     allowNull: true,
    //   }),
    // ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
    //   queryInterface.changeColumn("cart_items", "ledcolor", {
    //     type: Sequelize.STRING,
    //     allowNull: false,
    //   }),
    //   queryInterface.changeColumn("cart_items", "bodycolor", {
    //     type: Sequelize.STRING,
    //     allowNull: false,
    //   }),
    //   queryInterface.changeColumn("cart_items", "watts", {
    //     type: Sequelize.DOUBLE,
    //     allowNull: false,
    //   }),
    //   queryInterface.changeColumn("cart_items", "reflectors", {
    //     type: Sequelize.DOUBLE,
    //     allowNull: false,
    //   }),
    ]);
  },
};
