'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'gstNumber', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Users', 'companyName', {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'gstNumber');
    await queryInterface.removeColumn('Users', 'companyName');

  }
};
