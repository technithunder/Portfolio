interface StaticData {
  icon: string;
  title: string;
  desc: string;
}

interface PendingVerificationProps {
  icon: string;
  title: string;
  review_status?: string;
  total_pending?: number;
  urgent_review?: number;
  process_rate?: number;
  total_verified?: number;
  total_failed?: number;
}

interface StatusProps {
  title: string;
  count: string;
  days: string;
  icon: string;
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface CardConfig {
  title: string;
  filter: string;
  chartTitle: string;
  chartSubtitle: string;
  data: ChartDataItem[];
}

export const data: StaticData[] = [
  {
    icon: "verify",
    title: "To verify",
    desc: "102 Pending",
  },
  {
    icon: "review_application",
    title: "Review applications",
    desc: "54 new",
  },
  {
    icon: "support_ticket",
    title: "Support tickets",
    desc: "12 unresolved",
  },
  {
    icon: "app_rating",
    title: "App rating",
    desc: "4.5 Stars",
  },
];

export const status: StatusProps[] = [
  {
    title: "Active users",
    count: "1,450",
    days: "+12% vs last 30 days",
    icon: "users",
  },
  {
    title: "Active carers",
    count: "1,450",
    days: "+12% vs last 30 days",
    icon: "hospital",
  },
  {
    title: "Active clinicians",
    count: "1,450",
    days: "+12% vs last 30 days",
    icon: "hospital",
  },
  {
    title: "Active providers",
    count: "1,450",
    days: "+12% vs last 30 days",
    icon: "calendar",
  },
  {
    title: "Active brokerage",
    count: "1,450",
    days: "+12% vs last 30 days",
    icon: "calendar",
  },
  {
    title: "Inactive accounts",
    count: "1,450",
    days: "+12% vs last 30 days",
    icon: "calendar",
  },
  {
    title: "Turnover revenue",
    count: "£45,504",
    days: "+23% vs last 30 days",
    icon: "currency",
  },
  {
    title: "Commission revenue",
    count: "£10,000",
    days: "+23% vs last 30 days",
    icon: "currency",
  },
];

export const pending_verifications: PendingVerificationProps[] = [
  {
    icon: "single",
    title: "DBS Checks",
    review_status: "Pending",
    total_pending: 23,
    urgent_review: 5,
    process_rate: 65,
  },
  {
    icon: "paginate_text",
    title: "References",
    review_status: "Pending",
    total_pending: 23,
    urgent_review: 5,
    process_rate: 65,
  },
  {
    icon: "study_owl",
    title: "Qualifications",
    review_status: "Pending",
    total_pending: 23,
    urgent_review: 5,
    process_rate: 65,
  },
  {
    icon: "doc",
    title: "Documentation",
    review_status: "Pending",
    total_pending: 23,
    urgent_review: 5,
    process_rate: 65,
  },
  {
    icon: "face_id",
    title: "ID Status",
    total_failed: 102,
    total_verified: 706,
  },
];

export const time_period_data: string[] = [
  "1 Month",
  "3 Months",
  "6 Months",
  "12 Months",
  "18 Months",
  "24 Months",
];

export const cardConfigs: CardConfig[] = [
  {
    title: "User demographic",
    filter: "Age",
    chartTitle: "Most popular",
    chartSubtitle: "26-32 years (35%)",
    data: [
      { name: "18-24 year", value: 60, color: "#FFD62E" },
      { name: "25-34 years", value: 20, color: "#4E95ED" },
      { name: "35-44 years", value: 10, color: "#10B981" },
      { name: "45+ years", value: 10, color: "#F87171" },
    ],
  },
  {
    title: "Carer demographic",
    filter: "Age",
    chartTitle: "Most popular",
    chartSubtitle: "26-32 years (35%)",
    data: [
      { name: "18-24 year", value: 60, color: "#FFD62E" },
      { name: "25-34 years", value: 20, color: "#4E95ED" },
      { name: "35-44 years", value: 10, color: "#10B981" },
      { name: "45+ years", value: 10, color: "#F87171" },
    ],
  },
  {
    title: "Clinician demographic",
    filter: "Age",
    chartTitle: "Most popular",
    chartSubtitle: "26-32 years (35%)",
    data: [
      { name: "18-24 year", value: 60, color: "#FFD62E" },
      { name: "25-34 years", value: 20, color: "#4E95ED" },
      { name: "35-44 years", value: 10, color: "#10B981" },
      { name: "45+ years", value: 10, color: "#F87171" },
    ],
  },
  {
    title: "Provider analytics",
    filter: "Type",
    chartTitle: "Most popular",
    chartSubtitle: "Care home (35%)",
    data: [
      { name: "Care home", value: 60, color: "#FFD62E" },
      { name: "Care home", value: 20, color: "#4E95ED" },
      { name: "Care home", value: 10, color: "#10B981" },
      { name: "Care home", value: 10, color: "#F87171" },
    ],
  },
  {
    title: "Brokerage analytics",
    filter: "Booking Status",
    chartTitle: "Most popular",
    chartSubtitle: "26-32 years (35%)",
    data: [
      { name: "Completed", value: 60, color: "#FFD62E" },
      { name: "In Progress", value: 20, color: "#4E95ED" },
      { name: "In-progress", value: 10, color: "#10B981" },
      { name: "Canceled", value: 10, color: "#F87171" },
    ],
  },
  {
    title: "Booking analytics",
    filter: "Booking Status",
    chartTitle: "Most popular",
    chartSubtitle: "26-32 years (35%)",
    data: [
      { name: "Completed", value: 60, color: "#FFD62E" },
      { name: "In Progress", value: 20, color: "#4E95ED" },
      { name: "In-progress", value: 10, color: "#10B981" },
      { name: "Canceled", value: 10, color: "#F87171" },
    ],
  },
];

export const filterOptions: Record<string, { label: string; value: string }[]> =
  {
    Age: [
      { label: "18-24 years", value: "18-24" },
      { label: "25-34 years", value: "25-34" },
      { label: "35-44 years", value: "35-44" },
      { label: "45+ years", value: "45+" },
    ],
    Type: [
      { label: "Care home", value: "care_home" },
      { label: "Independent", value: "independent" },
    ],
    "Booking Status": [
      { label: "Completed", value: "completed" },
      { label: "In Progress", value: "in_progress" },
      { label: "Canceled", value: "canceled" },
    ],
  };
