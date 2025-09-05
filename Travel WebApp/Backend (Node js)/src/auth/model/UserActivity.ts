import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";

class UserVisaActivity extends Model {
  public id!: number;
  public userId!: number;
  public visaId!: number;
  public visitedAt!: Date;
  public messageSent!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserVisaActivity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    visaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    visitedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    messageSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "UserVisaActivity",
    timestamps: true,
  }
);

export default UserVisaActivity;
