import { Model, DataTypes } from 'sequelize';
import { sequelize } from "@/config/db.config";

class AdminUser extends Model {
  public id!:number;
  public user_name!: string;
  public password!: string;
  public role!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AdminUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false
    },
    role:{
      type:DataTypes.STRING,
      allowNull:false
    },
    name:{
      type:DataTypes.STRING,
      allowNull:true
    },
    phoneNumber:{
      type:DataTypes.STRING,
      allowNull:true
    },
    is_active:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:true
    }
  },
  {
    sequelize,
    tableName: 'AdminUser',
    timestamps: true,
  }
);

export default AdminUser;
