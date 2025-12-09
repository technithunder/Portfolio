export type CarerProfile = {
  success: boolean;
  message: string;
  data: CarerProfileData;
};

export type CarerProfileData = {
  createdAt: string;
  rateNegotiable: boolean;
  sortCode: string;
  accountNumber: string;
  drivingLicense: boolean;
  clinicalTittle: string | null;
  accountName: string;
  countryOfResidence: string | null;
  DBScertificate: string | null | undefined;
  documentType: string | null;
  specifyOther: string | null;
  isProfileCompleted: boolean;
  isIdInfoCompleted: boolean;
  isInsuranceCompleted: boolean;
  _id: string;
  userId: string;
  dob: string | null;
  address: string;
  houseNo: string;
  postCode: string;
  country: string;
  profile: string | null;
  experience: string | null;
  interestsHobbit: string | null;
  clinicalDuties: string | null;
  language: string | null;
  medicalSpecialties: string | null;
  careType: string | null;
  urgentCare: boolean;
  hourlyCare: boolean;
  overnightCare: boolean;
  liveInCare: boolean;
  ratePerHours: number | null;
  ratePerWeek: number | null;
  negotiable: boolean;
  personalStatement: string | null;
  car: boolean;
  drivingLicence: boolean;
  dogs: boolean;
  cats: boolean;
  timeSlots: TimeSlot[];
  calender: string | null;
  nationality: string | null;
  DBSorPVG: boolean;
  DBSorPVGDocument: string | null;
  DBSfor: string | null;
  DBS_issueDate: string | null;
  DBSNo: string | null;
  pinNumber: string | null;
  dateOfRegistration: string | null;
  regulatoryBody: string | null;
  expiryDate: string | null;
  refrence1Firstname: string | null;
  refrence1Lastname: string | null;
  refrence1Email: string | null;
  refrence1Contactno: string | null;
  refrence1Relation: string | null;
  refrence1RelationTime: string | null;
  refrence2Firstname: string | null;
  refrence2Lastname: string | null;
  refrence2Email: string | null;
  refrence2Contactno: string | null;
  refrence2Relation: string | null;
  refrence2RelationTime: string | null;
  additionalDocument: string | null;
  identificationDocument: string | null;
  identificationFrontCard: string | null;
  identificationBack: string | null;
  photo: string | null;
  trainingHoists: boolean;
  physiotherapy: boolean;
  PEG: boolean;
  stoma: boolean;
  workingStatus: string | null;
  workInUK: boolean;
  selfEmployed: boolean;
  smoker: boolean;
  workHome: boolean;
  personalAssistant: boolean;
  taxReferenceNo: boolean;
  taxNo: string | null;
  insuranceDocument: string | null;
  dateApproved: string | null;
  approvedBy: string | null;
  status: boolean;
  verificationStatus: string;
  responseRate: number;
  completedJobs: number;
  activeJobs: number;
  page: number;
  isActive: boolean;
  legalSigned: string | null;
  amount: number | null;
  paymentStatus: number;
  qualifications: Qualification[];
  bankDetails: BankDetail[];
  serviceAgreement: ServiceAgreement[];
  visitLog: VisitLog[];
  __v: number;
  careSchedule: CareSchedule[];
  reference: Reference[];
  fullName: string;
  email: string;
  updatedAt: string;
};

export interface TimeSlot {
  day: string;
  slots: {
    startTime: string;
    endTime: string;
  }[];
}

export interface Qualification {
  title: string;
  institution: string;
  year: string;
  certificate: string | null;
  _id?: string;
}

export interface BankDetail {
  accountName: string;
  accountNumber: string;
  sortCode: string;
  bankName: string;
  _id?: string;
}

export interface ServiceAgreement {
  name: string;
  signature: string;
  date: string;
  _id?: string;
}

export interface VisitLog {
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  notes: string;
  _id?: string;
}

export interface CareSchedule {
  day: string;
  startTime: string;
  endTime: string;
  _id?: string;
}

export interface Reference {
  contactNo: string;
  email: string;
  firstName: string;
  lastName: string;
  referenceRelation: string;
  referenceRelationDuration: string;
  _id?: string;
}
