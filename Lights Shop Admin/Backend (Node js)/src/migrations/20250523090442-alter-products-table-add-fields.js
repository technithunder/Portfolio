'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // Add new columns
    await Promise.all([
      // Remove the existing image column
      queryInterface.removeColumn('Products', 'image'),
      // Add new images column with JSON type
      queryInterface.addColumn('Products', 'images', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      })
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Revert column additions
    await Promise.all([
      queryInterface.removeColumn('Products', 'images'),
      queryInterface.addColumn('Products', 'image', {
        type: Sequelize.STRING,
        allowNull: true,
      })
    ]);
  }
};
