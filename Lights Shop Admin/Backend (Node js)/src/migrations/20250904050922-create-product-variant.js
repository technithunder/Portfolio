"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProductVariants", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
        },

      },
      ledColor: {
        type: Sequelize.JSONB, // { color: "red", discount: 5 }
        allowNull: true,
      },
      bodyColor: {
        type: Sequelize.JSONB, // { color: "blue", discount: 5 }
        allowNull: true,
      },
      watts: {
        type: Sequelize.JSONB, // { value: 45, discount: 5 }
        allowNull: true,
      },
      reflector: {
        type: Sequelize.JSONB, // [ { value: 45, discount: 5 } ]
        allowNull: true,
      },
      stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ProductVariants");
  },
};
