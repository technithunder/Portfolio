import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@/config/db.config';
import User from '@/auth/model/User';

class ScheduledCall extends Model {
    public id!: number;
    public userId!: number;
    public date!: Date;
    public timeSlot!: string;
    public userName!: string;
    public userPhone!: string;
    public userEmail!: string;
    public description?: string;
    public meetLink?: string;
    public eventId?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ScheduledCall.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        timeSlot: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userPhone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userEmail: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        meetLink: {
            type: DataTypes.STRING,
            allowNull: true
        },
        eventId: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: 'ScheduledCalls',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['date', 'timeSlot']
            }
        ]
    }
);

// Define association
ScheduledCall.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default ScheduledCall;
