'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add unique index on orderNumber in Orders table
    await queryInterface.addIndex('Orders', ['orderNumber'], {
      name: 'unique_orderNumber_index', // explicit name
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the unique index by name
    await queryInterface.removeIndex('Orders', 'unique_orderNumber_index');
  }
};
