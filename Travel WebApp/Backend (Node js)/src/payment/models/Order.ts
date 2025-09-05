import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@/config/db.config';
import User from '@/auth/model/User';
import VisaDetails from '@/admin/country/models/VisaDetails';
import { VisaApplication } from '@/visaApplication/model';

class Order extends Model {
    public id!: number;
    public userId!: number;
    public visaId!: number;
    public applicationId!:number;
    public amount!: number;
    public orderId!: string;
    public status!: string;
    public description?: string;
    public paymentId?: string;
    public signatureId?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Order.init(
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
        visaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: VisaDetails,
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        applicationId:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: VisaApplication,
                key: 'id'
            },
            onDelete: 'CASCADE',
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
        description: {
            type: DataTypes.TEXT,
            allowNull: true
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
        tableName: 'Orders',
        timestamps: true
    }
);

export default Order;
