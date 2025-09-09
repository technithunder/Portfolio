'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('cart_items', 'reflectors', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('cart_items', 'reflectors', {
      type: Sequelize.DOUBLE,
      allowNull: true
    });
  }
};
