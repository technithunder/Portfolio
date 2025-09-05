import User from '@/auth/model/User';
import ChildUser from '@/childUser/models/ChildUser';
import VisaApplication from './VisaApplicationDetails';
import VisaDetails from '@/admin/country/models/VisaDetails';
import VisaApplicant from './VisaApplicant';
import AdminUser from '@/admin/login/model/AdminUser';
import VisaApplicationStatus from './VisaAppStatus';

// Associations
User.hasMany(ChildUser, { foreignKey: 'parentUserId', as: 'childUsers' });
User.hasMany(VisaApplication, { foreignKey: 'parentUserId', as: 'visaApplications' });

ChildUser.belongsTo(User, { foreignKey: 'parentUserId', as: 'parentUser' });
ChildUser.hasMany(VisaApplicant, { foreignKey: 'childUserId', as: 'visaApplications' });

VisaDetails.hasMany(VisaApplication, { foreignKey: 'visaId', as: 'visaApplications' });
VisaApplication.belongsTo(VisaDetails, { foreignKey: 'visaId', as: 'visaDetail' });

VisaApplication.belongsTo(User, { foreignKey: 'parentUserId', as: 'parentUser' });
VisaApplication.hasMany(VisaApplicant, { foreignKey: 'visaApplicationId', as: 'applicants' });

VisaApplicant.belongsTo(VisaApplication, { foreignKey: 'visaApplicationId', as: 'visaApplication' });
VisaApplicant.belongsTo(ChildUser, { foreignKey: 'childUserId', as: 'childUser' });

VisaApplication.belongsTo(AdminUser, { foreignKey: 'assignTo', as: 'assignedUser' });
AdminUser.hasMany(VisaApplication, { foreignKey: 'assignTo', as: 'assignedApplications' });

VisaApplication.hasMany(VisaApplicationStatus, { foreignKey: 'appId', as: 'statusLogs' });
VisaApplicationStatus.belongsTo(VisaApplication, { foreignKey: 'appId', as: 'visaApplication' });


ChildUser.belongsTo(VisaDetails, { foreignKey: 'visaId', as: 'visa' });
VisaDetails.hasMany(ChildUser, { foreignKey: 'visaId', as: 'children' });
export { User, ChildUser, VisaDetails, VisaApplication, VisaApplicant, AdminUser, VisaApplicationStatus };
