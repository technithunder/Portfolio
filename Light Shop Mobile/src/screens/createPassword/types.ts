import {ParamListBase} from '@react-navigation/native';
import {ForwardedRef} from 'react';
import {ActionSheetRef} from 'react-native-actions-sheet';

export interface ChangedSheetProps {
  ref: ForwardedRef<ActionSheetRef>;
  onHomePress: () => void;
}

export interface ParamsProps extends ParamListBase {
  CreatePassword: {email: string};
}
