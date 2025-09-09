'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('DeviceTokens', 'token');

    // Add 'mobiletoken' column
    await queryInterface.addColumn('DeviceTokens', 'mobiletoken', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add 'webtoken' column
    await queryInterface.addColumn('DeviceTokens', 'webtoken', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert: remove 'mobiletoken' and 'webtoken'
    await queryInterface.removeColumn('DeviceTokens', 'mobiletoken');
    await queryInterface.removeColumn('DeviceTokens', 'webtoken');

    // Revert: add back 'token'
    await queryInterface.addColumn('DeviceTokens', 'token', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
