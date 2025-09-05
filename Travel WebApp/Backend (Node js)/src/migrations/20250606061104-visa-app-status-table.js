'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('VisaAppStatus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      appId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'VisaApplications',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM(
          'created',
          'payment-pending',
          'submitted',
          'under-review',
          'document-pending',
          'interview-scheduled',
          'approved',
          'rejected'
        ),
        allowNull: false,
        defaultValue: 'created'
      },
      remarks: {
        type: Sequelize.STRING,
        allowNull: true
      },
      document: {
        type: Sequelize.STRING,
        allowNull: true
      },
      changedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      changedBy: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('VisaAppStatus');
  }
};
