'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('complaintNotes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      complaintId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'complaints', // matches your Complaint table
          key: 'id'
        },

      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // matches your User table
          key: 'id'
        },

      },
      note: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      // If later you add replyToNoteId or noteType, you'd add columns here

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // Helpful indexes for query performance
    await queryInterface.addIndex('complaintNotes', ['complaintId']);
    await queryInterface.addIndex('complaintNotes', ['userId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('complaintNotes');
  }
};
