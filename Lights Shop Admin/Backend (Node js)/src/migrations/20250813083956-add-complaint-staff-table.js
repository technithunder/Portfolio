'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('complaintStaffs', {
      complaintId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: { tableName: 'complaints' }, // ✅ raw table name
          key: 'id'
        }
      },
      staffId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: { tableName: 'Users' }, // ✅ raw table name
          key: 'id'
        },

      }
    });

    // Indexes
    await queryInterface.addIndex('complaintStaffs', ['complaintId']);
    await queryInterface.addIndex('complaintStaffs', ['staffId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('complaintStaffs');
  }
};
