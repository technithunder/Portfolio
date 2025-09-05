'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ScheduledCalls', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            timeSlot: {
                type: Sequelize.STRING,
                allowNull: false
            },
            userName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            userPhone: {
                type: Sequelize.STRING,
                allowNull: false
            },
            userEmail: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            meetLink: {
                type: Sequelize.STRING,
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });

        // Add unique constraint to prevent double booking
        await queryInterface.addConstraint('ScheduledCalls', {
            fields: ['date', 'timeSlot'],
            type: 'unique',
            name: 'unique_date_timeslot'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ScheduledCalls');
    }
};
