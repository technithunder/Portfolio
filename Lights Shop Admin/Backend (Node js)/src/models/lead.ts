// models/lead.ts
import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";
import User from "./user";

export class Lead extends Model {
  public id!: number;
  public email?: string;
  public customerName?: string;
  public mobileNumber?: string;
  public type?: string;
  public requirement?: string;
  public followUpDate?: Date;
  public followUpTime?: Date;
  public createdBy?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Lead.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("hot", "warm", "cold", "medium"),
      allowNull: true,
    },
    requirement: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    followUpDate: {
      type: DataTypes.DATEONLY, // Only date (YYYY-MM-DD)
      allowNull: true,
    },
    followUpTime: {
      type: DataTypes.TIME, // Only time (HH:mm:ss)
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Lead",
    tableName: "leads",
    paranoid: true,
    deletedAt: 'deletedAt',
    timestamps: true,
  }
);

Lead.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});
