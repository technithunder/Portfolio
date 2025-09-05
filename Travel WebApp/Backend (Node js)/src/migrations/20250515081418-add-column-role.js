'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('AdminUser', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'admin'
    }),
    await queryInterface.addColumn('AdminUser', 'name', {
      type: Sequelize.STRING,
      allowNull: true,
    }),
    await queryInterface.addColumn('AdminUser', 'phoneNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    }),
    await queryInterface.addColumn('AdminUser', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('AdminUser', 'role');
    await queryInterface.removeColumn('AdminUser', 'name');
    await queryInterface.removeColumn('AdminUser', 'phoneNumber');
    await queryInterface.removeColumn('AdminUser', 'isActive');
  }
};
