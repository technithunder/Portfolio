import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@/config/db.config';

export class Category extends Model {
  public id!: number;
  public name!: string;

  static associate(models: any) {
    // A category can be used in many orders
    Category.hasMany(models.Order, { foreignKey: 'categoryId', as: 'orders' });

    // A category can be used in many products
    Category.hasMany(models.Product, { foreignKey: 'categoryId', as: 'products' });
  }
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'Categories'
  }
);
