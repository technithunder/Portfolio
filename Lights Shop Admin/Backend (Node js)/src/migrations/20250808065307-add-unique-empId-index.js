'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('Users', ['empId'], {
      name: 'unique_empId_index', // ✅ explicit name
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Users', 'unique_empId_index');
  }
};
