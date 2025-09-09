export interface ExtractedVisaDetails {
  ADDRESS: string;
  CITY_IN_ADDRESS: string;
  CLASS: string;
  COUNTY: string;
  DATE_OF_BIRTH: string;
  DATE_OF_ISSUE: string;
  DOCUMENT_NUMBER: string;
  ENDORSEMENTS: string;
  EXPIRATION_DATE: string;
  FIRST_NAME: string;
  ID_TYPE: string;
  LAST_NAME: string;
  MIDDLE_NAME: string;
  MRZ_CODE: string;
  PLACE_OF_BIRTH: string;
  RESTRICTIONS: string;
  STATE_IN_ADDRESS: string;
  STATE_NAME: string;
  SUFFIX: string;
  VETERAN: string;
  ZIP_CODE_IN_ADDRESS: string;
}

export interface MiniTravelersItemProps {
  id: number;
  parentUserId: number;
  step: number;
  visaId: number;
  photo: string;
  passport: string;
  createdAt: string;
  updatedAt: string;
  details: {
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
    passportNumber: string;
    passportIssuedOn: string;
    passportValidUntil: string;
    passportFrom: string;
    placeOfBirth: string;
  };
  extractedVisaDetails: ExtractedVisaDetails;
}

export interface MiniTravelersProps {
  item: MiniTravelersItemProps;
  isSelected: boolean;
  onPressChildCard: (item: MiniTravelersItemProps) => void;
  onItemPress: (item: MiniTravelersItemProps) => void;
  onDelete: (item: MiniTravelersItemProps) => void;
}
