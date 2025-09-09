'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'panCardNumber', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Users', 'bankName', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Users', 'accountNumber', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Users', 'bankBranchName', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Users', 'ifscCode', {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'panCardNumber');
    await queryInterface.removeColumn('Users', 'bankName');
    await queryInterface.removeColumn('Users', 'accountNumber');
    await queryInterface.removeColumn('Users', 'bankBranchName');
    await queryInterface.removeColumn('Users', 'ifscCode');
  }
};
