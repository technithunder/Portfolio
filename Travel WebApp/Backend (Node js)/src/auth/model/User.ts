import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";

class User extends Model {
  public id!: number;
  public email!: string;
  public phoneNumber!: string | null;
  public isVerified!: boolean;
  public photo!: string | null;
  public city!: string | null;
  public alternateNo!: string | null;
  public passportFront!: string | null;
  public passportBack!: string | null;
  public incomeTaxReturn!: string | null;
  public adharCard!: string | null;
  public panCard!: string | null;
  public firstName!: string | null;
  public lastName!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
 
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alternateNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passportFront:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    passportBack:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    incomeTaxReturn:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    adharCard:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    panCard:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName:{
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: "User",
    timestamps: true,
  }
);

export default User;
