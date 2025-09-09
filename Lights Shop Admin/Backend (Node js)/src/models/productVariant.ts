import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";
import Product from "./product";

class ProductVariant extends Model {
    public id!: number;
    public productId!: number;
    public ledColor?: object;
    public bodyColor?: object;
    public watts?: object;
    public reflector?: object;
    public stock!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ProductVariant.init(
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
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
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
        tableName: "ProductVariants",
        timestamps: true,
    }
);

ProductVariant.belongsTo(Product, { foreignKey: "productId" });
export default ProductVariant;
