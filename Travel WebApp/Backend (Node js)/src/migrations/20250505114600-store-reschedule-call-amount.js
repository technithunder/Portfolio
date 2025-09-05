'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ScheduledCallsAmount', {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },   
      amount: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      timeDuration: {
          type: Sequelize.STRING,
          allowNull: false
      },
      createdAt: {
          type: Sequelize.DATE,
          allowNull: false
      },
      updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('ScheduledCallsAmount');
  }
};
