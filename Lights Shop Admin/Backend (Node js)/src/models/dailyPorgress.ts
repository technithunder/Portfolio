import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db.config';
import User from './user';
export class DailyProgress extends Model { }

DailyProgress.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },

        date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        inTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },

        leadChecked: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },

        leadFollowed: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },

        checkedTomorrowTasks: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },

        reportingSheetSent: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },

        outTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'DailyProgress',
        tableName: 'dailyProgress',
        timestamps: true, // adds createdAt and updatedAt
    }
);

