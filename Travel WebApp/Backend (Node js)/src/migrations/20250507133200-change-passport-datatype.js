'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('ChildUsers', 'passport');
    await queryInterface.addColumn('ChildUsers', 'passport', {
      type: Sequelize.JSONB
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('ChildUsers', 'passport', {
      type: Sequelize.JSON
    });
  }
};
