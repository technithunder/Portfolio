"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("leads", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      customerName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mobileNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM("hot", "warm", "cold", "medium"), // <-- ENUM here
        allowNull: true,
      },
      requirement: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      followUpDate: {
        type: Sequelize.DATEONLY, // Only date (YYYY-MM-DD)
        allowNull: true,
      },
      followUpTime: {
        type: Sequelize.TIME, // Only time (HH:mm:ss)
        allowNull: true,
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("leads");
  },
};
