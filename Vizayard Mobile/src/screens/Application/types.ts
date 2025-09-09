import {TouchableOpacityProps} from 'react-native';

export interface MiniApplicationProps extends TouchableOpacityProps {
  item: {
    id: number;
    parentUserId: number;
    childUserId: number;
    visaId: number;
    expectedVisaDate: string; // e.g., "12-jan-2025"
    visaType: string;
    visaCategory: string;
    status: string;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    visaDetail: VisaDetail;
  };
}

export interface VisaDetail {
  id: number;
  step: number;
  basicDetails: BasicDetails;
  visaDetails: VisaDetails;
  documents: Documents;
  additionalDetails: AdditionalDetails;
  createdAt: string;
  updatedAt: string;
}

export interface BasicDetails {
  coverImage: string;
  countryName: string;
  successRate: number;
  expectedTime: string;
}

export interface VisaDetails {
  visaFee: number;
  visaType: string;
  visaEntry: string;
  vizayardFee: number;
  lengthOfStay: string;
  validityPeriod: string;
  visaGaurrentedOn: string; // e.g., "12-jan-2025"
}

export interface Documents {
  photo: boolean;
  passport: boolean;
  bankStatement: boolean;
  incomeTaxReturn: boolean;
}

export interface AdditionalDetails {
  faqs: FAQ[];
}

export interface FAQ {
  question: string;
  answer: string;
}
