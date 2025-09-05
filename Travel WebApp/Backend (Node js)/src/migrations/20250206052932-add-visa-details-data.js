'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('VisaDetails', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      step: {
        type: Sequelize.INTEGER,        
        allowNull: false
      },
      basicDetails: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      visaDetails: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      documents: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      additionalDetails:{
        type:Sequelize.JSONB,
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
    });
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.dropTable('VisaDetails');
  }
};
