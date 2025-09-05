import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/config/db.config";

class ScheduleCallAmount extends Model {
    public id!: number;
    public amount!: number;
    public timeDuration!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ScheduleCallAmount.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timeDuration: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'ScheduledCallsAmount',
    timestamps: true

});

export default ScheduleCallAmount;