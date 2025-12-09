type EmailVerifiedStatus = "Pending" | "Verified";

interface UsersData {
  id?: number;
  name?: string;
  dateJoined?: string;
  lastLogin?: string;
  emailVerified?: EmailVerifiedStatus;
  loginMethod?: string;
}

export const usersData: UsersData[] = [
  {
    id: 1,
  name: "Trent Graham",
  dateJoined: "05.02.2025",
  lastLogin: "05.02.2025",
  emailVerified: "Pending",
  loginMethod: "Email",
  },
  {
    id: 2,
  name: "Haylee Owen",
  dateJoined: "05.02.2025",
  lastLogin: "05.02.2025",
  emailVerified: "Verified",
  loginMethod: "Apple",
  },
  {
    id: 3,
  name: "Trent Graham",
  dateJoined: "05.02.2025",
  lastLogin: "05.02.2025",
  emailVerified: "Verified",
  loginMethod: "Google",
  },
  {
    id: 4,
  name: "Flynn James",
  dateJoined: "05.02.2025",
  lastLogin: "05.02.2025",
  emailVerified: "Pending",
  loginMethod: "Facebook",
  },
  {
    id: 5,
  name: "Trent Graham",
  dateJoined: "05.02.2025",
  lastLogin: "05.02.2025",
  emailVerified: "Verified",
  loginMethod: "Email",
  },
  {
    id: 6,
  name: "Gideon Perez",
  dateJoined: "05.02.2025",
  lastLogin: "05.02.2025",
  emailVerified: "Pending",
  loginMethod: "Facebook",
  },
  {
    id: 7,
  name: "Zara Yu",
  dateJoined: "05.02.2025",
  lastLogin: "05.02.2025",
  emailVerified: "Verified",
  loginMethod: "Email",
  },
  {
    id: 8,
  name: "Zara Yu",
  dateJoined: "05.02.2025",
  lastLogin: "05.02.2025",
  emailVerified: "Pending",
  loginMethod: "Email",
  },
  {
    id: 9,
  name: "Trent Graham",
  dateJoined: "05.02.2025",
  lastLogin: "05.02.2025",
  emailVerified: "Verified",
  loginMethod: "Facebook",
  },
  {
    id: 10,
  name: "Trent Graham",
  dateJoined: "05.02.2025",
  lastLogin: "05.02.2025",
  emailVerified: "Pending",
  loginMethod: "Email",
  },
];
