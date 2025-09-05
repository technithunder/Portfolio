import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    phoneNo: {
        countryCode: '',
        number: '',
    },
    user: {
        token: '',
        userId: '',
    },
    userData: {
        photo: '',
        email: '',
        city: '',
        altPhoneNo: {
            countryCode: '',
            number: '',
        },
        isSkipped: false
    },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setPhoneNo: (state, action) => {
            state.phoneNo = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setUserData: (state, action) => {
            state.userData = { ...state.userData, ...action.payload };
        },
        logoutUser: () => {
            return initialState;
        }
    },
});

export const { setPhoneNo, setUser, setUserData, logoutUser } = userSlice.actions;
export default userSlice.reducer;
