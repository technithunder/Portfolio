import {createSlice} from '@reduxjs/toolkit';

interface initialValType {
  travelersAppID: number;
  visaDetails?: Object;
  deviceToken?: string;
  userToken?: string;
}

export const mainSliceInitialValue: initialValType = {
  travelersAppID: 0,
  visaDetails: {},
  deviceToken: '',
  userToken: '',
};

const MainSlice = createSlice({
  name: 'main',
  initialState: mainSliceInitialValue,
  reducers: {
    addTravelersAppID: (state, action) => {
      state.travelersAppID = action.payload;
    },
    addVisaDetails: (state, action) => {
      state.visaDetails = action.payload;
    },
    addDeviceToken: (state, action) => {
      state.deviceToken = action.payload;
    },
    addUserToken: (state, action) => {
      state.userToken = action.payload;
    },
  },
});

export const {addTravelersAppID, addVisaDetails, addDeviceToken, addUserToken} =
  MainSlice.actions;

export default MainSlice.reducer;
