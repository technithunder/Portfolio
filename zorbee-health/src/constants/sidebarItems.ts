interface SidebarItemType {
  activeIcon?: string;
  title: string;
  pathName?: string;
  children?: SidebarItemType[];
}

export const sidebarItems: SidebarItemType[] = [
  {
    activeIcon: "dashboard",
    title: "Dashboard",
    pathName: "dashboard",
  },
  {
    activeIcon: "carers",
    title: "Carers",
    children: [
      {
        title: "Overview",
        pathName: "carers/overview",
      },
      {
        title: "Verifications",
        pathName: "carers/verifications",
      },
      {
        title: "Payment requests",
        pathName: "carers/payment-requests",
      },
      {
        title: "Approvals",
        pathName: "carers/approvals",
      },
    ],
  },
  {
    activeIcon: "clinical",
    title: "Clinical",
    children: [
      {
        title: "Overview",
        pathName: "clinical/overview",
      },
      {
        title: "Verifications",
        pathName: "clinical/verifications",
      },
      {
        title: "Payment requests",
        pathName: "clinical/payment-requests",
      },
      {
        title: "Approvals",
        pathName: "clinical/approvals",
      },
    ],
  },
  {
    activeIcon: "providers",
    title: "Providers",
    children: [
      {
        title: "Overview",
        pathName: "providers/overview",
      },
      {
        title: "Verifications",
        pathName: "providers/verifications",
      },
      {
        title: "Approvals",
        pathName: "providers/approvals",
      },
    ],
  },
  {
    activeIcon: "users",
    title: "Users",
    children: [
      {
        title: "Overview",
        pathName: "users/overview",
      },
    ],
  },
  {
    activeIcon: "support",
    title: "Support",
    children: [
      {
        title: "Carer",
        pathName: "support/carer",
      },
      {
        title: "Clinical",
        pathName: "support/clinical",
      },
      {
        title: "User",
        pathName: "support/user",
      },
      {
        title: "Provider",
        pathName: "support/provider",
      },
    ],
  },
  {
    activeIcon: "settings",
    title: "Settings",
    children: [
      {
        title: "CMS",
        pathName: "settings/cms",
      },
      {
        title: "Access",
        pathName: "settings/access",
      },
      {
        title: "Push notifications",
        pathName: "settings/push-notifications",
      },
      {
        title: "App feedback",
        pathName: "settings/app-feedback",
      },
    ],
  },
  {
    activeIcon: "reporting",
    title: "Reporting",
    children: [
      {
        title: "Transaction history",
        pathName: "reporting/transaction-history",
      },
      {
        title: "Export data",
        pathName: "reporting/performance-reports",
      },
    ],
  },
  {
    activeIcon: "notifications",
    title: "Notifications",
    pathName: "notifications",
  },
];
