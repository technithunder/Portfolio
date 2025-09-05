'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('VisaApplicants', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            visaApplicationId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'VisaApplications',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            childUserId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'ChildUsers',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            status: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'pending'
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
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true
            }
        });

        // Add unique constraint to prevent duplicate applicants
        await queryInterface.addConstraint('VisaApplicants', {
            fields: ['visaApplicationId', 'childUserId'],
            type: 'unique',
            name: 'unique_visa_application_child'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('VisaApplicants');
    }
};
