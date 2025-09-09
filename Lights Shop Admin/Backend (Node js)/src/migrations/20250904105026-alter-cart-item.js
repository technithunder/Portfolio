"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove old columns
    await queryInterface.removeColumn("cart_items", "bodycolor");
    await queryInterface.removeColumn("cart_items", "watts");
    await queryInterface.removeColumn("cart_items", "ledcolor");
    await queryInterface.removeColumn("cart_items", "reflectors");

    // Add new JSONB columns
    await queryInterface.addColumn("cart_items", "bodycolor", {
      type: Sequelize.JSONB,
    });
    await queryInterface.addColumn("cart_items", "watts", {
      type: Sequelize.JSONB,
    });
    await queryInterface.addColumn("cart_items", "ledcolor", {
      type: Sequelize.JSONB,
    });
    await queryInterface.addColumn("cart_items", "reflectors", {
      type: Sequelize.JSONB,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert back to original column definitions
    await queryInterface.removeColumn("cart_items", "bodycolor");
    await queryInterface.removeColumn("cart_items", "watts");
    await queryInterface.removeColumn("cart_items", "ledcolor");
    await queryInterface.removeColumn("cart_items", "reflectors");

    await queryInterface.addColumn("cart_items", "bodycolor", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("cart_items", "watts", {
      type: Sequelize.DOUBLE,
    });
    await queryInterface.addColumn("cart_items", "ledcolor", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("cart_items", "reflectors", {
      type: Sequelize.DOUBLE,
    });
  },
};
