'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OrderNotes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      // replyToNoteId: {
      //   type: Sequelize.INTEGER,
      //   allowNull: true,
      //   references: {
      //     model: 'OrderNotes',
      //     key: 'id'
      //   },
      //   onDelete: 'SET NULL',
      //   onUpdate: 'CASCADE'
      // },
      // noteType: {
      //   type: Sequelize.ENUM('staff', 'admin'),
      //   allowNull: false
      // },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the ENUM first (important for Postgres)
    await queryInterface.dropTable('OrderNotes');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_OrderNotes_noteType";');
  }
};
