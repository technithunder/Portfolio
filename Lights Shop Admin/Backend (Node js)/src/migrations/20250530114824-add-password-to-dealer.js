'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // Add new columns
    // await Promise.all([
    //   queryInterface.removeColumn('Dealers', 'password')
    //   // Add new password column with string type

    // ]);
  },

  async down(queryInterface, Sequelize) {
    // Revert column additions
    // await Promise.all([
    //   queryInterface.addColumn('Dealers', 'password', {
    //     type: Sequelize.STRING,
    //     allowNull: false,
    //   })
    // ]);
  }
};
