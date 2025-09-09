// leadstaff.ts
import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";
import User from "./user";
import { Lead } from "./lead";
import Complaint from "./complaint";

export class complaintStaff extends Model { }
complaintStaff.init(
    {
        complaintId: {
            type: DataTypes.INTEGER,
            references: {
                model: Complaint, // ✅ use table name
                key: "id",
            },
        },
        staffId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "id",
            },
        },
    },
    {
        sequelize,
        tableName: "complaintStaffs",
        timestamps: false,
    }
);
// Complaint.belongsToMany(User, {
//     through: complaintStaff,
//     as: "assignedStaff",
//     foreignKey: "complaintId",
// });

// User.belongsToMany(Lead, {
//     through: complaintStaff,
//     as: "assignedComplaints",
//     foreignKey: "staffId",
// });

// Lead.hasMany(complaintStaff, { foreignKey: "complaintId" });
// complaintStaff.belongsTo(Lead, { foreignKey: "complaintId" });
// User.hasMany(complaintStaff, { foreignKey: "staffId" });
// complaintStaff.belongsTo(User, { foreignKey: "staffId" });


// Complaint ↔ User via complaintStaff (many-to-many)
Complaint.belongsToMany(User, {
    through: complaintStaff,
    as: "assignedStaff",
    foreignKey: "complaintId",
    otherKey: "staffId"
});

User.belongsToMany(Complaint, {
    through: complaintStaff,
    as: "assignedComplaints",
    foreignKey: "staffId",
    otherKey: "complaintId"
});

// Optional direct hasMany on join model if you need raw joins
User.hasMany(complaintStaff, { foreignKey: "staffId", as: "complaintStaff" });
complaintStaff.belongsTo(User, { foreignKey: "staffId" });

Complaint.hasMany(complaintStaff, { foreignKey: "complaintId" });
complaintStaff.belongsTo(Complaint, { foreignKey: "complaintId" });
