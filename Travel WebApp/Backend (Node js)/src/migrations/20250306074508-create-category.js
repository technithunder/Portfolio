'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable('VisaCategory', {
      id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
      label:{
        type:Sequelize.STRING,
        allowNull:false
      },
      value:{
        type:Sequelize.STRING,
        allowNull:false
      },
      deleteAt:{
        type:Sequelize.DATE,
        allowNull:true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    })
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('VisaCategory');
     
  }
};
