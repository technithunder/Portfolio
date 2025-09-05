import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@/config/db.config';

interface VisaDetailsAttributes {
    id: number;
    step: number;
    basicDetails?: object;
    visaDetails?: object;
    documents?: object;
    additionalDetails?: object;
    trending?: boolean;
    trendingOrder?: number;
}

interface VisaDetailsCreationAttributes extends Optional<VisaDetailsAttributes, 'id'> {}

class VisaDetails extends Model<VisaDetailsAttributes, VisaDetailsCreationAttributes> {
    public id!: number;
    public step!: number;
    public basicDetails?: object;
    public visaDetails?: object;
    public documents?: object;
    public additionalDetails?: object;
    public trending!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

VisaDetails.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        step: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        basicDetails: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        visaDetails: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        documents: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        additionalDetails: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        trending: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        trendingOrder: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: 'VisaDetails',
        timestamps: true
    }
);

export default VisaDetails;
