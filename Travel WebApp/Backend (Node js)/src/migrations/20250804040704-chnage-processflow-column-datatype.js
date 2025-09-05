'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Remove the old column
    await queryInterface.removeColumn('VisaDetails', 'processFlow');

    // Step 2: Re-add it as JSON type
    await queryInterface.addColumn('VisaDetails', 'processFlow', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Optional: revert the change by removing and re-adding as TEXT (or whatever original type was)
    await queryInterface.removeColumn('VisaDetails', 'processFlow');

    await queryInterface.addColumn('VisaDetails', 'processFlow', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
};
