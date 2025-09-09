'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LeadStaffs', {
      leadId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'leads',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      staffId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('LeadStaffs');
  }
};
