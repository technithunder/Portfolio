import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.config";
import User from "./user"; // Adjust path as needed

export class DeviceToken extends Model { }

DeviceToken.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        mobiletoken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        webtoken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        deviceType: {
            type: DataTypes.ENUM("mobile", "web"),
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: "DeviceToken",
        tableName: "DeviceTokens",
        timestamps: true,
    }
);

// Association
User.hasMany(DeviceToken, { foreignKey: "userId", as: "deviceTokens" });
DeviceToken.belongsTo(User, { foreignKey: "userId", as: "user" });

export default DeviceToken;
