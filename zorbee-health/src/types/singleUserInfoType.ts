export interface UserInfo {
  _id: string;
  userId: string;
  dob: string;
  address: string;
  houseNo: string;
  postCode: string;
  country: string;
  fundingType: {
    name: string;
    value: number;
  };
  careHelp: Array<{
    name: string;
    value: number;
  }>;
  careService: Array<{
    name: string;
    value: number;
  }>;
  carerGender: {
    name: string;
    value: number;
  };
  carerLanguage: Array<{
    name: string;
    value: number;
  }>;
  driver: boolean;
  smoker: boolean;
  pets: boolean;
  petDetails: string;
  carerInterests: Array<{
    name: string;
    value: number;
  }>;
  carerDetails: string;
  serviceRequirements: Array<{
    name: string;
    value: number;
  }>;
  careStart: {
    name: string;
    value: number;
  };
  overallBookings: string | number;
  activeAgreements: string | number;
  totalSafetyAlerts: string | number;
  supportTickets: string | number;
  careStartTime: string;
  careEndTime: string;
  careStartDate: string;
  hoursPerWeek: number;
  flexibleTime: boolean;
  hourlyRate: number;
  page: number;
  specialtySearch: Record<string, unknown>;
  isBloodPressureEnable: boolean;
  isFitnessTrackerEnable: boolean;
  isHeartRateMonitor: boolean;
  isFaceIbEnabled: boolean;
  isProfileCompleted: boolean;
  isAboutMeCompleted: boolean;
  isCarePreferenceCompleted: boolean;
  wearableDevice: boolean;
  careSchedules: Record<string, unknown>;
  topspecialtySearch: Record<string, unknown>;
  __v: number;
  expectedDuration: {
    name: string;
    value: number;
  };
  fullName: string;
  email: string;
  // Optional fields based on your interface
  careDays?: number[];
  timeSlots?: number[];
}

export interface UserInfoResponse {
  data: {
    success: boolean;
    data: UserInfo;
  };
}
