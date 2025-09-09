import {TouchableOpacityProps} from 'react-native';

export interface CountryProps extends TouchableOpacityProps {
  item: VisaInfo;
}
export interface mainDataType {
  data: VisaInfo[];
  totalPages: number;
  totalVisas: number;
  pages: number;
}
type VisaDetails = {
  lengthOfStay: string;
  validityPeriod: string;
  visaEntry: string;
  visaFee: string;
  visaGaurrentedOn: string; // ISO date string
  visaTime: string; // ISO date string
  visaType: string;
  vizayardFee: number;
};

type DocumentRequirements = {
  bankStatement: boolean;
  incomeTaxReturn: boolean;
  passport: boolean;
  photo: boolean;
};

type FAQ = {
  question: string;
  answer: string;
};

type BasicDetails = {
  countryName: string;
  coverImage?: any;
  expectedTime: string; // or number if always numeric
  successRate: number;
};

type VisaInfo = {
  id: number;
  step: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  basicDetails: BasicDetails;
  visaDetails: VisaDetails;
  documents: DocumentRequirements;
  additionalDetails: {
    faqs: FAQ[];
  };
};
