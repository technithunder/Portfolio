import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@/config/db.config';

class ChildUser extends Model {
    public id!: number;
    public parentUserId!: number;
    public visaType!: string;
    public visaCategory!: string;
    public visaId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ChildUser.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        parentUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        visaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'VisaDetails',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        photo: { type: DataTypes.STRING, allowNull: true },
        documents: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            get() {
                const value = this.getDataValue('documents');
                return value || [];
            }
        },
        passport: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        extractedVisaDetails: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        details: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        step: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'ChildUsers',
        timestamps: true
    }
);

export default ChildUser;
