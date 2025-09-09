import {RootState} from './store';

export const getCountryDetail = (state: RootState) => state.main.visaDetails;
export const getDeviceTokenR = (state: RootState) => state.main.deviceToken;
