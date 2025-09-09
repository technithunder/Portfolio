import {Images} from './images';

export const loaderData = Array.from({length: 6});
export const applicationStatusData = [
  {title: 'Created', id: 1, key: 'created'},
  {title: 'Pending Documentation', id: 2, key: 'pending'},
  {title: 'Approved', id: 3, key: 'approved'},
  {title: 'Rejected', id: 4, key: 'rejected'},
  {title: 'Completed', id: 5, key: 'completed'},
  {title:'Payment Pending', id: 6, key: 'payment-pending'},
  {title:'Under Review', id: 7, key: 'under-review'},
  {title:'Interview Scheduled', id: 7, key: 'interview-scheduled'},
  {title:'Submitted', id: 9, key: 'submitted'},
];

export const loginCarouselData1 = [
  {
    id: 1,
    image: Images.login1,
  },
  {
    id: 2,
    image: Images.login2,
  },
  {
    id: 3,
    image: Images.login3,
  },
  {
    id: 4,
    image: Images.login4,
  },
  {
    id: 5,
    image: Images.login5,
  },
  {
    id: 6,
    image: Images.login6,
  },
  {
    id: 7,
    image: Images.login7,
  },
  {
    id: 8,
    image: Images.login8,
  },
  {
    id: 9,
    image: Images.login9,
  },
  {
    id: 10,
    image: Images.login10,
  },
  {
    id: 11,
    image: Images.login11,
  },
  {
    id: 12,
    image: Images.login12,
  },
];

export const loginCarouselData2 = [
  {
    id: 1,
    image: Images.login8,
  },
  {
    id: 2,
    image: Images.login1,
  },
  {
    id: 3,
    image: Images.login10,
  },
  {
    id: 4,
    image: Images.login2,
  },
  {
    id: 5,
    image: Images.login11,
  },
  {
    id: 6,
    image: Images.login4,
  },
  {
    id: 7,
    image: Images.login12,
  },
  {
    id: 8,
    image: Images.login5,
  },
  {
    id: 9,
    image: Images.login7,
  },
  {
    id: 10,
    image: Images.login6,
  },
  {
    id: 11,
    image: Images.login3,
  },
  {
    id: 12,
    image: Images.login9,
  },
]


export const loginCarouselData3 = [
  {
    id: 1,
    image: Images.login12,
  },
  {
    id: 2,
    image: Images.login11,
  },
  {
    id: 3,
    image: Images.login10,
  },
  {
    id: 4,
    image: Images.login9,
  },
  {
    id: 5,
    image: Images.login8,
  },
  {
    id: 6,
    image: Images.login7,
  },
  {
    id: 7,
    image: Images.login6,
  },
  {
    id: 8,
    image: Images.login5,
  },
  {
    id: 9,
    image: Images.login4,
  },
  {
    id: 10,
    image: Images.login3,
  },
  {
    id: 11,
    image: Images.login2,
  },
  {
    id: 12,
    image: Images.login1,
  },
]


export const loopedData1 = Array.from({length: 100}).flatMap(
  () => loginCarouselData1,
); // Repeat your original data many times

export const loopedData2 = Array.from({length: 100}).flatMap(
  () => loginCarouselData2,
);

export const loopedData3 = Array.from({length: 100}).flatMap(
  () => loginCarouselData3,
);

export const selectTimeSlot = [
  {
    id: 1,
    time: '9:00 AM - 10:00 AM',
  },
  {
    id: 2,
    time: '10:00 AM - 11:00 AM',
  },
  {
    id: 3,
    time: '11:00 AM - 12:00 PM',
  },
  {
    id: 4,
    time: '01:00 PM - 02:00 PM',
  },
  {
    id: 5,
    time: '02:00 PM - 03:00 PM',
  },
  {
    id: 6,
    time: '03:00 PM - 04:00 PM',
  },
  {
    id: 7,
    time: '04:00 PM - 05:00 PM',
  },
  {
    id: 8,
    time: '06:00 PM - 07:00 PM',
  },
  {
    id: 9,
    time: '07:00 PM - 08:00 PM',
  },
  {
    id: 9,
    time: '09:00 PM - 10:00 PM',
  },
];

export const applicationStatusBgColor = {
  pending: '#FFF7ED',               // Pending Documentation
  approved: '#E0F2FE',              // Approved
  rejected: '#FEF2F2',              // Rejected
  completed: '#F0FDF4',             // Completed
  created: '#FFF7ED',               // Created
  'payment-pending': '#FFF7ED',     // Payment Pending
  submitted: '#EDE9FE',             // Example: light purple
  'under-review': '#FEF9C3',        // Example: light yellow
  'interview-scheduled': '#DBEAFE', // Example: light blue
};

export const applicationStatusTextColor = {
  pending: '#EA580C',
  approved: '#0284C7',
  rejected: '#DC2626',
  completed: '#059669',
  created: '#363231',
  'payment-pending': '#363231',
  submitted: '#7C3AED',             // Example: deep purple
  'under-review': '#A16207',        // Example: dark yellow
  'interview-scheduled': '#1D4ED8', // Example: blue
};

export const applicationStatusText = {
  pending: 'Pending Documentation',
  approved: 'Approved',
  rejected: 'Rejected',
  completed: 'Completed',
  created: 'Created',
  'payment-pending': 'Payment Pending',
  submitted: 'Submitted',
  'under-review': 'Under Review',
  'interview-scheduled': 'Interview Scheduled',
};
