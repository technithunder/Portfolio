"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("Orders", "userId", {
      type: Sequelize.INTEGER,
      allowNull: true, // Allow null initially for existing records
      references: {
        model: "Users", // Make sure this matches your users table name
        key: "id",
      },
      onDelete: "CASCADE",
    });
    await queryInterface.addColumn("Orders", "productId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    // Add productName column
    await queryInterface.addColumn("Orders", "productName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    // Add unitPrice column
    await queryInterface.addColumn("Orders", "unitPrice", {
      type: Sequelize.DOUBLE,
      allowNull: true,
    });
    await queryInterface.addColumn("Orders", "orderNumber", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
    // Change buyingPrice from FLOAT to DECIMAL for better precision
    await queryInterface.changeColumn("Orders", "buyingPrice", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });
    await queryInterface.changeColumn("Orders", "customerName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Orders", "userId");
    await queryInterface.removeColumn("Orders", "productId");
    await queryInterface.removeColumn("Orders", "productName");
    await queryInterface.removeColumn("Orders", "unitPrice");
    await queryInterface.removeColumn("Orders", "orderNumber");
    // Revert buyingPrice back to FLOAT
    await queryInterface.changeColumn("Orders", "buyingPrice", {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
    await queryInterface.changeColumn("Orders", "customerName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
