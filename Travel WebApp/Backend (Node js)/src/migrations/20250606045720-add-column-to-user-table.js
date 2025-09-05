'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('User','lastName',{
      type:Sequelize.STRING,
      allowNull:true
    })
    await queryInterface.addColumn('User','firstName',{
      type:Sequelize.STRING,
      allowNull:true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('User','lastName')
    await queryInterface.removeColumn('User','firstName')
  }
};
