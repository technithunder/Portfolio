"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove columns
    await queryInterface.removeColumn("Orders", "image");
    await queryInterface.removeColumn("Orders", "buyingPrice");
    await queryInterface.removeColumn("Orders", "categoryId");
    await queryInterface.removeColumn("Orders", "quantityId");
    await queryInterface.removeColumn("Orders", "unitPrice");

    // Add new columns
    await queryInterface.addColumn("Orders", "totalAmount", {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn("Orders", "totalItems", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert: Add back removed columns
    await queryInterface.addColumn("Orders", "image", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Orders", "buyingPrice", {
      type: Sequelize.FLOAT,
      allowNull: false,
    });

    await queryInterface.addColumn("Orders", "categoryId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.addColumn("Orders", "quantityId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.addColumn("Orders", "unitPrice", {
      type: Sequelize.DOUBLE,
      allowNull: true,
      validate: {
        min: 0,
      },
    });

    // Remove new columns
    await queryInterface.removeColumn("Orders", "totalAmount");
    await queryInterface.removeColumn("Orders", "totalItems");
  },
};
