import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userPhoto: null,
    step1: {},
    passportFrontPhoto: null,
    passportBackPhoto: null,
    step2: {},
    formData: {
        firstName: '',
        lastName: '',
        maritalStatus: '',
        gender: '',
        passportIssuedOn: '',
        dateOfBirth: '',
        passportValidTill: '',
        passportNumber: '',
        fatherName: '',
        motherName: '',
        email: '',
        phoneNo: '',
    },
    userData: {},
    exppectedDate: ""
};

export const visaApplicationSlice = createSlice({
    name: 'visaApplication',
    initialState,
    reducers: {
        userPhoto: (state, action) => {
            state.userPhoto = action.payload;
        },
        step1Data: (state, action) => {
            state.step1 = action.payload;
        },
        step2Data: (state, action) => {
            state.step2 = action.payload;
        },
        userData: (state, action) => {
            state.userData = action.payload;
        },
        exppectedDate: (state, action) => {
            state.exppectedDate = action.payload;
        },
        passportFrontPhoto: (state, action) => {
            state.passportFrontPhoto = action.payload;
        },
        passportBackPhoto: (state, action) => {
            state.passportBackPhoto = action.payload;
        },
        setFormData: (state, action) => {
            state.formData = { ...state.formData, ...action.payload };
        },
        deleteAll: (state) => {
            state.userPhoto = null,
                state.step1 = {},
                state.passportFrontPhoto = null,
                state.passportBackPhoto = null,
                state.step2 = {},
                state.formData = {
                    firstName: '',
                    lastName: '',
                    maritalStatus: '',
                    gender: '',
                    passportIssuedOn: '',
                    dateOfBirth: '',
                    passportValidTill: '',
                    passportNumber: '',
                    fatherName: '',
                    motherName: '',
                    email: '',
                    phoneNo: '',
                },
                state.userData = {}
        },
        deleteExppectedDate: (state) => {
            state.exppectedDate = ""
        }
    },
});

export const { userPhoto, passportFrontPhoto, step1Data, step2Data, passportBackPhoto, deleteExppectedDate, exppectedDate, setFormData, deleteAll, userData } = visaApplicationSlice.actions;
export default visaApplicationSlice.reducer;
