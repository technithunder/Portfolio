/**
 * @format
 */
import React from 'react';
import {ConfirmModalContextType} from './';

const ConfirmModalContext = React.createContext<
  ConfirmModalContextType | undefined
>(undefined);

export {ConfirmModalContext};
