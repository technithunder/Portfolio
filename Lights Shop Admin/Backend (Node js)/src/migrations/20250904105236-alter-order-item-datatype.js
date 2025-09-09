"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove old columns
    // await queryInterface.removeColumn("OrderItems", "ledcolors");
    // await queryInterface.removeColumn("OrderItems", "bodycolors");
    // await queryInterface.removeColumn("OrderItems", "watts");
    // await queryInterface.removeColumn("OrderItems", "reflectors");

    // // Add new JSONB columns
    // await queryInterface.addColumn("OrderItems", "ledcolors", {
    //   type: Sequelize.JSONB,
    // });
    // await queryInterface.addColumn("OrderItems", "bodycolors", {
    //   type: Sequelize.JSONB,
    // });
    // await queryInterface.addColumn("OrderItems", "watts", {
    //   type: Sequelize.JSONB,
    // });
    // await queryInterface.addColumn("OrderItems", "reflectors", {
    //   type: Sequelize.JSONB,
    // });
  },

  async down(queryInterface, Sequelize) {
    // Revert back to original types
    // await queryInterface.removeColumn("OrderItems", "ledcolors");
    // await queryInterface.removeColumn("OrderItems", "bodycolors");
    // await queryInterface.removeColumn("OrderItems", "watts");
    // await queryInterface.removeColumn("OrderItems", "reflectors");

    // await queryInterface.addColumn("OrderItems", "ledcolors", {
    //   type: Sequelize.STRING,
    // });
    // await queryInterface.addColumn("OrderItems", "bodycolors", {
    //   type: Sequelize.STRING,
    // });
    // await queryInterface.addColumn("OrderItems", "watts", {
    //   type: Sequelize.STRING,
    // });
    // await queryInterface.addColumn("OrderItems", "reflectors", {
    //   type: Sequelize.STRING,
    // });
  },
};
