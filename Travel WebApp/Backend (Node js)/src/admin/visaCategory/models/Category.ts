import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/config/db.config";

class VisaCategory extends Model {
    public id!: number;
    public label!: string;
    public value!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

VisaCategory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        label: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: "VisaCategory",
        timestamps: true
    }
);

export default VisaCategory;
