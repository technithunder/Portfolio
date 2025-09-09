'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'finalPayment', {
      type: Sequelize.STRING,
      allowNull: true, // change to false if required
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'finalPayment');
  }
};
