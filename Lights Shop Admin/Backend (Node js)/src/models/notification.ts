import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.config";
import User from "./user"; // Adjust path if needed

export class Notification extends Model { }

Notification.init(
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
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        data: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM("sent", "failed"),
            allowNull: false,
        },
        errorMessage: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        fcmResponse: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        mobileRedirect: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        webRedirectUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Notification",
        tableName: "Notifications",
        timestamps: true,
    }
);

// Association
User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Notification;
