import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.config"; // adjust the import as needed

export class Address extends Model { }

Address.init(
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

        street: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        },
        state: {
            type: DataTypes.STRING,
        },
        country: {
            type: DataTypes.STRING,
        },
        zipCode: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: "Address",
        tableName: "Addresses",
        timestamps: true,
    }
);

// Association setup (in index.ts or after all models are defined)
import User from "./user";
User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
Address.belongsTo(User, { foreignKey: "userId", as: "user" });
