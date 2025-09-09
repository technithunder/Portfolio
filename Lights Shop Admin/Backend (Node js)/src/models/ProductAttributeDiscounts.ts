import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";
import Product from "./product";

class ProductAttributeDiscount extends Model {
    public id!: number;
    public productId!: number;
    public ledColor?: object;
    public bodyColor?: object;
    public watts?: object;
    public reflector?: object;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ProductAttributeDiscount.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Product,
                key: "id",
            },
        },
        ledColor: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        bodyColor: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        watts: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        reflector: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "ProductAttributeDiscounts",
        timestamps: true,
    }
);

ProductAttributeDiscount.belongsTo(Product, { foreignKey: "productId" });
export default ProductAttributeDiscount;
