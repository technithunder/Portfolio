"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Rename the old enum type
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Orders_status" RENAME TO "enum_Orders_status_old";
    `);

    // Step 2: Create the new enum type with updated values
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Orders_status" AS ENUM (
        'admin_approval',
        'approved',
        'process_for_advance',
        'update_receipt',
        'processing',
        'production',
        'production_finished',
        'rest_of_payment',
        'admin_final_approval',
        'out_for_delivery',
        'dispatched',
        'delivered',
        'cancelled'
      );
    `);

    // Step 3: Alter the column to use the new enum type
    await queryInterface.sequelize.query(`
      ALTER TABLE "Orders"
      ALTER COLUMN "status" DROP DEFAULT,
      ALTER COLUMN "status" TYPE "enum_Orders_status"
        USING "status"::text::"enum_Orders_status",
      ALTER COLUMN "status" SET DEFAULT 'admin_approval';
    `);

    // Step 4: Drop the old enum type
    await queryInterface.sequelize.query(`
      DROP TYPE "enum_Orders_status_old";
    `);
  },

  async down(queryInterface, Sequelize) {
    // Recreate the old enum type
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Orders_status_old" AS ENUM (
        'order_placed',
        'processing',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled'
      );
    `);

    // Revert column back to old enum
    await queryInterface.sequelize.query(`
      ALTER TABLE "Orders"
      ALTER COLUMN "status" DROP DEFAULT,
      ALTER COLUMN "status" TYPE "enum_Orders_status_old"
        USING "status"::text::"enum_Orders_status_old",
      ALTER COLUMN "status" SET DEFAULT 'order_placed';
    `);

    // Drop the new enum type
    await queryInterface.sequelize.query(`
      DROP TYPE "enum_Orders_status";
    `);

    // Rename old back
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Orders_status_old" RENAME TO "enum_Orders_status";
    `);
  },
};
