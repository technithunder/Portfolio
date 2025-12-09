export interface Location {
  type: "Point";
  coordinates: [number, number];
  _id: string;
}

export interface TeamMember {
  name: string;
  role: string;
  photoUrl?: string;
}

export interface ProviderProfile {
  serviceArea: string | null;
  yearInBusiness: number | null;
  turnover: number | null;
  cqcDocument: string | null;
  isBusinessProfileComplete: boolean;
  isCompanyVerified: boolean;
  services: string | null;
  currentlyAvailable: boolean;
  vacantBeds: number | null;
  _id: string;
  userId: string;
  dob: string;
  address: string | null;
  houseNo: string | null;
  postCode: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  video: string | null;
  coverImage: string | null;
  businessLogo: string | null;
  businessName: string | null;
  contactNo: string | null;
  typeOfProvider: string | null;
  companyNumber: string | null;
  yearinBusiness: number | null;
  headCount: number | null;
  tournOver: number | null;
  pricing: string | null;
  teamMembers: TeamMember[];
  cqc: string | null;
  dateApproved: string | null;
  approvedBy: string | null;
  status: string;
  verificationStatus: string;
  responseRate: number;
  engagementRate: number;
  page: number;
  jobRole: number;
  location: Location;
  createdAt: string;
  updatedAt: string;
  __v: number;
  fullName: string;
  email: string;
}

export interface ProviderProfileResponse {
  data: {
    success: boolean;
    data: ProviderProfile;
  };
}
