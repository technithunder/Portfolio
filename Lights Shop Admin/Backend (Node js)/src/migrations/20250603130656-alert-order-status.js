"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Orders", "status", {
      type: Sequelize.ENUM(
        "order_placed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled"
      ),
      defaultValue: "order_placed",
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // To rollback, drop the ENUM column and ENUM type
    await queryInterface.removeColumn("Orders", "status");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Orders_status";'
    );
  },
};
