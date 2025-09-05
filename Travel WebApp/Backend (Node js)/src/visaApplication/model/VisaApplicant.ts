import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@/config/db.config';

class VisaApplicant extends Model {
    public id!: number;
    public visaApplicationId!: number;
    public childUserId!: number;
    public status!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

VisaApplicant.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        visaApplicationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'VisaApplications',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        childUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ChildUsers',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending'
        }
    },
    {
        sequelize,
        tableName: 'VisaApplicants',
        timestamps: true,
        paranoid: true
    }
);

export default VisaApplicant;
