import { Suspense, lazy } from 'react';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const Client = Loader(lazy(() => import('src/content/client/Client')));
const AddClient = Loader(lazy(() => import('src/content/client/Client/Add')));
const ClientView = Loader(lazy(() => import('src/content/client/Client/View')));

const AddClientDocument = Loader(
  lazy(() => import('src/content/client/Document/Add'))
);
const AddClientNotes = Loader(
  lazy(() => import('src/content/client/Notes/Add'))
);
const AddContact = Loader(lazy(() => import('src/content/client/Contact/Add')));

const clientRoutes = [
  {
    path: 'partner',
    element: <Client />,
    children: [
      {
        path: 'add',
        element: <AddClient />
      },
      {
        path: 'edit/:id',
        element: <AddClient />
      },
      {
        path: 'view/:id',
        element: <ClientView />,
        children: [
          {
            path: 'contact/add',
            element: <AddContact />
          },
          {
            path: 'contact/edit/:clientcontactId',
            element: <AddContact />
          },
          {
            path: 'document/add',
            element: <AddClientDocument />
          },
          {
            path: 'document/edit/:clientDocumentId',
            element: <AddClientDocument />
          },
          {
            path: 'notes/add',
            element: <AddClientNotes />
          },
          {
            path: 'notes/edit/:clientNoteId',
            element: <AddContact />
          }
        ]
      }
    ]
  }
];

export default clientRoutes;
