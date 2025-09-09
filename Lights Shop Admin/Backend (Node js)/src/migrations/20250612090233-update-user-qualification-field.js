"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove old columns
    await queryInterface.removeColumn("Users", "degree");
    await queryInterface.removeColumn("Users", "university");
    await queryInterface.removeColumn("Users", "passingYear");
    await queryInterface.removeColumn("Users", "percentage");

    // Add new JSONB column for qualification
    await queryInterface.addColumn("Users", "qualification", {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback: Add back the removed columns
    await queryInterface.addColumn("Users", "degree", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Users", "university", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Users", "passingYear", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Users", "percentage", {
      type: Sequelize.FLOAT,
    });

    // Remove the new qualification column
    await queryInterface.removeColumn("Users", "qualification");
  },
};
