'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image: {
        type: Sequelize.STRING, // store image URL or file path
        allowNull: true
      },
      buyingPrice: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories', // table name (not model name)
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // or 'CASCADE' based on your need
      },
      quantityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Quantities', // table name (not model name)
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // or 'CASCADE' based on your need
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};
