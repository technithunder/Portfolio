import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@/config/db.config';
import User from '@/auth/model/User';
import ScheduledCall from '@/scheduledCall/models/ScheduledCall';

class ScheduleCallOrder extends Model {
    public id!: number;
    public userId!: number;
    public scheduleCallId!: number;
    public amount!: number;
    public orderId!: string;
    public status!: string;
    public paymentId?: string;
    public signatureId?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ScheduleCallOrder.init(
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
            }
        },
        scheduleCallId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: ScheduledCall,
                key: 'id'
            }
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        orderId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'created'
        },
        paymentId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        signatureId: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: 'ScheduleCallOrders',
        timestamps: true
    }
);

export default ScheduleCallOrder;
