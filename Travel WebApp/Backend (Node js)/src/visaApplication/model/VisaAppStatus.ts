import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@/config/db.config';

class VisaApplicationStatus extends Model {
    public id!: number;
    public appId!: number;
    public status!: string;
    public remarks!: string;
    public document!: string;
    public readonly changedAt!: Date;
    public readonly changedBy!: number;
}

VisaApplicationStatus.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        appId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'VisaApplications',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        status: {
            type: DataTypes.ENUM(
              'created',
              'payment-pending',
              'submitted',
              'under-review',
              'document-pending',
              'interview-scheduled',
              'approved',
              'rejected'
            ),
            allowNull: false,
            defaultValue: 'created'
          },
        remarks:{
            type: DataTypes.STRING,
            allowNull: true
        },
        document:{
            type: DataTypes.STRING,
            allowNull: true
        },
         changedAt:{
            type: DataTypes.DATE,
            allowNull: false
         },
         changedBy:{
            type: DataTypes.INTEGER,
            allowNull: false
         }
    },
    {
        sequelize,
        tableName: 'VisaAppStatus',
        timestamps: true,
        createdAt: 'changedAt',
        updatedAt: false
    }
);

export default VisaApplicationStatus;
