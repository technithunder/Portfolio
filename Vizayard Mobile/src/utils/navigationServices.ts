import * as React from 'react';
import {
  CommonActions,
  NavigationContainerRef,
  NavigationProp,
  StackActions,
} from '@react-navigation/native';

export const navigationRef =
  React.createRef<NavigationContainerRef<NavigationProp<any>>>();

export const navigate = (name: string, params?: any) => {
  navigationRef.current?.navigate(name as any, params as any);
};

export const push = (name: string, params?: any) => {
  navigationRef.current?.dispatch(StackActions.push(name, params));
};

export const replace = (name: string, params?: any) => {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
};

export const goBack = () => {
  navigationRef.current?.goBack();
};

export const reset = (name: string) => {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{name: name}],
    }),
  );
};
