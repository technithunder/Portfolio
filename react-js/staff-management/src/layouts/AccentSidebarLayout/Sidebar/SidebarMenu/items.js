import AnalyticsTwoToneIcon from '@mui/icons-material/AnalyticsTwoTone';
import VpnKeyTwoToneIcon from '@mui/icons-material/VpnKeyTwoTone';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';

const menuItems = [
  {
    heading: 'General',
    items: [
      {
        name: 'Dashboard',
        icon: DashboardIcon,
        link: '/'
      },
      {
        name: 'Partners',
        icon: AnalyticsTwoToneIcon,
        link: '/partner'
      },
      {
        name: 'Projects',
        icon: VpnKeyTwoToneIcon,
        link: 'projects/project'
      },
      {
        name: 'Employees',
        icon: AccountCircleIcon,
        link: 'employee/employee'
      },
      {
        name: 'RAP management',
        icon: AnalyticsTwoToneIcon,
        link: 'RAP/RAP'
      },
      {
        name: 'Reports',
        icon: AssessmentIcon,
        link: '/report',
        items: [
          {
            name: 'Certified Payroll Reports',
            link: 'report/CertifiedPayrollReport'
          }
        ]
      },
      {
        name: 'Settings',
        icon: SettingsApplicationsIcon,
        link: '/setting',
        items: [
          {
            name: 'Job Title',
            link: 'setting/job-title'
          },
          {
            name: 'Address Type',
            link: 'setting/address-type'
          },
          {
            name: 'Bonus Type',
            link: 'setting/bonus-type'
          },
          {
            name: 'Compensation Type',
            link: 'setting/compensation-type'
          },
          {
            name: 'Client Document Type',
            link: 'setting/clientdocument-type'
          },
          {
            name: 'Project Type',
            link: 'setting/project-type'
          },
          {
            name: 'Industry Type',
            link: 'setting/industry-type'
          },
          {
            name: 'Department Type',
            link: 'setting/department-type'
          },
          {
            name: 'SocialMedia Type',
            link: 'setting/socialMedia-type'
          },
          {
            name: 'Contract Type',
            link: 'setting/clientcontract-type'
          },
          {
            name: 'Employee Status Type',
            link: 'setting/employeestatus-type'
          },
          {
            name: 'Employee Document Type',
            link: 'setting/employeedocument-type'
          },
          {
            name: 'Employee Term Type',
            link: 'setting/employeeterm-type'
          },
          {
            name: 'Fringe Payment Method Type',
            link: 'setting/fringepaymentmethod-type'
          },
          {
            name: 'Job Category',
            link: 'setting/jobcategory'
          },
          {
            name: 'Language Type',
            link: 'setting/language-type'
          },
          {
            name: 'Notification Type',
            link: 'setting/notification-type'
          },
          {
            name: 'Work Type',
            link: 'setting/work-type'
          }
        ]
      }
    ]
  }
];

export default menuItems;
