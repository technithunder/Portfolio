import { Model, DataTypes } from 'sequelize';
import { sequelize } from "@/config/db.config";

// Role enum for better type safety

class Staff extends Model {
  public id!: number;
  public user_name!: string;
  public password!: string;
  public role!: string;
  public name!: string;
  public phoneNumber?: string;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Staff.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'AdminUser',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['user_name']
      }
    ]
  }
);

export default Staff;