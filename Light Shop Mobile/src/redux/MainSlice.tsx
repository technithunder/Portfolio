import {createSlice} from '@reduxjs/toolkit';
import {Image} from 'react-native-image-crop-picker';

interface initialValType {
  credential?: {
    email: string;
    password: string;
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    phone: string;
    profileImage: Image | null;
  };
}

export const mainSliceInitialValue: initialValType = {
  credential: {
    email: '',
    password: '',
  },
  user: {
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    phone: '',
    profileImage: null,
  },
};

const MainSlice = createSlice({
  name: 'main',
  initialState: mainSliceInitialValue,
  reducers: {
    setCredential: (state, action) => {
      state.credential = action.payload;
      state.user.email = action.payload.email;
    },
    setUsersData: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {setCredential, setUsersData} = MainSlice.actions;

export default MainSlice.reducer;
