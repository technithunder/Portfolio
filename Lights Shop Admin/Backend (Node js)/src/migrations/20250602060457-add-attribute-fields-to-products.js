"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "ledColors", {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn("Products", "bodyColors", {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn("Products", "watts", {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn("Products", "reflectors", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Products", "ledColors");
    await queryInterface.removeColumn("Products", "bodyColors");
    await queryInterface.removeColumn("Products", "watts");
    await queryInterface.removeColumn("Products", "reflectors");
  },
};
