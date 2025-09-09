import {RootState} from './store';

export const getCredential = (state: RootState) => state.main.credential;
export const getUser = (state: RootState) => state.main.user;
