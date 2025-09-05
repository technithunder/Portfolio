import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const EmployeeDocument = Loader(
  lazy(() => import('src/content/Employee/ManageEmployee/Document'))
);
const EmployeeNotes = Loader(
  lazy(() => import('src/content/Employee/ManageEmployee/Notes'))
);
const EmployeeSocialMedia = Loader(
  lazy(() => import('src/content/Employee/ManageEmployee/SocialMedia'))
);
const AddEmployeeDocument = Loader(
  lazy(() => import('src/content/Employee/ManageEmployee/Document/Add'))
);
const AddEmployeeNotes = Loader(
  lazy(() => import('src/content/Employee/ManageEmployee/Notes/Add'))
);
const AddEmployeeSocialMedia = Loader(
  lazy(() => import('src/content/Employee/ManageEmployee/SocialMedia/Add'))
);
const Employee = Loader(lazy(() => import('src/content/Employee/Main')));
const EmployeeTimeSheet = Loader(
  lazy(() => import('src/content/Employee/ManageEmployee/TimeSheet'))
);
const AddEmployee = Loader(lazy(() => import('src/content/Employee/Main/Add')));
const AddEmployeeTimeSheet = Loader(
  lazy(() => import('src/content/Employee/ManageEmployee/TimeSheet/Add'))
);

const ManageEmployee = Loader(
  lazy(() => import('src/content/Employee/ManageEmployee'))
);

const employeeRoutes = [
  {
    path: '',
    element: <Navigate to="employee" replace />
  },
  {
    path: 'employee',
    element: <Employee />,
    children: [
      {
        path: 'add',
        element: <AddEmployee />
      },
      {
        path: 'edit/:id',
        element: <AddEmployee />
      },
      {
        path: 'ManageEmployee/:id',
        element: <ManageEmployee />,
        children: [
          {
            path: 'employee-time-sheet',
            element: <EmployeeTimeSheet />
          },
          {
            path: 'employee-time-sheet/add',
            element: <AddEmployeeTimeSheet />
          },
          {
            path: 'socialmedia',
            element: <EmployeeSocialMedia />
          },
          {
            path: 'socialmedia/add',
            element: <AddEmployeeSocialMedia />
          },
          {
            path: 'notes',
            element: <EmployeeNotes />
          },
          {
            path: 'notes/add',
            element: <AddEmployeeNotes />
          },
          {
            path: 'document',
            element: <EmployeeDocument />
          },
          {
            path: 'document/add',
            element: <AddEmployeeDocument />
          }
        ]
      }
    ]
  }
];

export default employeeRoutes;
