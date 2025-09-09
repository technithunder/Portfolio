'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the old column
    await queryInterface.removeColumn('Orders', 'isApproved');

    // Add the new enum column
    await queryInterface.addColumn('Orders', 'approvedStatus', {
      type: Sequelize.ENUM('pending', 'reject', 'approve'),
      allowNull: false,
      defaultValue: 'pending',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the new enum column
    await queryInterface.removeColumn('Orders', 'approvedStatus');

    // Drop the enum type manually (important in PostgreSQL)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Orders_approvedStatus";');

    // Re-add the old column
    await queryInterface.addColumn('Orders', 'isApproved', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },
};
