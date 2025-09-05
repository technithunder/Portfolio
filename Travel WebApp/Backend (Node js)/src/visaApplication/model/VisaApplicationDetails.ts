import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@/config/db.config';

class VisaApplication extends Model {
    assignedUser: any;
    assignTo: any;
    public id!: number;
    public parentUserId!: number;
    public visaId!: number;
    public expectedVisaDate!: string;
    public visaType!: string;
    public visaCategory!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    status: any;
}

VisaApplication.init(
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
            allowNull: true,
            references: {
                model: 'VisaDetails',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        // expectedVisaDate: {
        //     type: DataTypes.STRING,
        //     allowNull: false
        // },
        visaType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        visaCategory: {
            type: DataTypes.STRING,
            allowNull: false
        },
        travelDate: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'created'
        },
        assignTo:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'AdminUser',
                key: 'id'
            },
            onDelete: 'SET NULL'
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: 'VisaApplications',
        timestamps: true
    }
);

export default VisaApplication;
