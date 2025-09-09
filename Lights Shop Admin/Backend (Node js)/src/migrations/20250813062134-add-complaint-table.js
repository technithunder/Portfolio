'use strict';

const COMPLAINT_STATUS = ['open', 'in_progress', 'resolved', 'closed', 'cancelled'];
const COMPLAINT_PRIORITY = ['low', 'medium', 'high', 'urgent'];

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create complaints table
    await queryInterface.createTable('complaints', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders', // adjust if your orders table name differs
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM(...COMPLAINT_STATUS),
        allowNull: true
      },
      priority: {
        type: Sequelize.ENUM(...COMPLAINT_PRIORITY),
        allowNull: true
      },
      targetCloseDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdById: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // adjust if your users table differs
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      updatedById: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('complaints');
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_complaints_status";`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_complaints_priority";`);
  }
};
