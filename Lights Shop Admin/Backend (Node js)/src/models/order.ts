import { Model, DataTypes, Sequelize } from "sequelize";
import { sequelize } from "@/config/db.config";
import User from "./user";
import OrderStaff from "./orderStaff";

class Order extends Model {
  public id!: number;
  public customerName!: string;
  public image?: string;
  public buyingPrice!: number;
  public categoryId!: number;
  public quantityId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    totalAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    totalItems: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    discountAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      validate: {
        min: 1,
      },
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderPayment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    finalPayment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shippingAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    approvedStatus: {
      type: DataTypes.ENUM(
        "pending",
        "reject",
        "approve"
      ),
      defaultValue: "pending",
    },
    expectedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expectedMaterial: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    query: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "admin_approval",
        "approved",
        'process_for_advance',
        'update_receipt',
        'processing',
        'production',
        "production_finished",
        'rest_of_payment',
        "admin_final_approval",
        "out_for_delivery",
        "dispatched",
        "delivered",
        "cancelled"
      ),
      defaultValue: "admin_approval",
    },
  },
  {
    sequelize,
    tableName: "Orders",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["orderNumber"], // prevent duplicate wishlists
      },
    ],
    hooks: {
      beforeCreate: async (order: any) => {
        // 🔁 Generate a unique order number
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 5) {
          const randomNum = Math.floor(1000 + Math.random() * 9000);
          const generatedOrderNumber = `ORD-${randomNum}`;
          const existingOrder = await Order.findOne({
            where: { orderNumber: generatedOrderNumber },
          });

          if (!existingOrder) {
            order.orderNumber = generatedOrderNumber;
            isUnique = true;
          }

          attempts++;
        }

        if (!isUnique) {
          throw new Error("Failed to generate a unique order number");
        }

        // Auto-populate customerName from User
        if (!order.customerName && order.userId) {
          const user: any = await User.findByPk(order.userId);
          if (user) {
            order.customerName = user.name;
          }
        }
      },
    }
  }
);
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });
export default Order;
