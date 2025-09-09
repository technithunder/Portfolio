import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@/config/db.config';

class Admin extends Model{
  public email!: string;
  public id!: number;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'Admins',
    timestamps: true
  }
);

export default Admin;
