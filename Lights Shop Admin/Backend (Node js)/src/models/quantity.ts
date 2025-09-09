import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@/config/db.config';


export class Quantity extends Model {
  public id!: number;
  public value!: number;

  static associate(models: any) {
    // A quantity can be used in many orders
    Quantity.hasMany(models.Order, { foreignKey: 'quantityId', as: 'orders' });

    // A quantity can be used in many products
    Quantity.hasMany(models.Product, { foreignKey: 'quantityId', as: 'products' });
  }
}

Quantity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    modelName: 'Quantity',
    tableName: 'Quantities'
  }
);
