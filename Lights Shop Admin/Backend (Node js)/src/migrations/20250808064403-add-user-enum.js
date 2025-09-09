'use strict';

// You need to replace 'Users' with your actual table name, if it's different.
// Also, update the enum type name if your table or column are named differently.

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Users_role"
      ADD VALUE IF NOT EXISTS 'customer';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Note: Removing an ENUM value in PostgreSQL is not straightforward,
    // so the down migration is generally left empty or you may need to 
    // create a new enum, migrate data, swap, and drop the old type.
  },
};
