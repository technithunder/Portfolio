import {KeyboardAvoidingView, ScrollView, View} from 'react-native';
import React, {FC, memo} from 'react';
import {verticalScale} from 'react-native-size-matters';

import {ReactNode} from 'react';
import {ScrollViewProps, StyleProp, ViewProps, ViewStyle} from 'react-native';
import Header, {HeaderProps} from '../Header';
import styles from './styles';
import {commonSty} from '../../theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isIOS} from '../../utils';

export interface ContainerProps
  extends ViewProps,
    ScrollViewProps,
    HeaderProps {
  children: ReactNode;
  isScroll?: boolean;
  isAvoidKeyboard?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  center?: boolean;
  showHeader?: boolean;
}

export interface areaProps {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const Container: FC<ContainerProps> = props => {
  const {
    children,
    containerStyle,
    isScroll,
    isAvoidKeyboard,
    center,
    showHeader = true,
    ...restProps
  } = props;
  const topInset = useSafeAreaInsets().top;

  if (isScroll) {
    return (
      <>
        {showHeader && <Header {...restProps} />}
        <ScrollView
          contentContainerStyle={[styles.main, containerStyle]}
          showsVerticalScrollIndicator={false}
          bounces={false}
          nestedScrollEnabled
          {...restProps}>
          {children}
        </ScrollView>
      </>
    );
  }

  if (isAvoidKeyboard) {
    return (
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={isIOS ? 'padding' : 'height'}
        keyboardVerticalOffset={isIOS ? 0 : verticalScale(-30)}>
        {showHeader && <Header {...restProps} />}
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            containerStyle,
            !showHeader && commonSty.containerInset(topInset),
          ]}>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View
      style={[
        !containerStyle && showHeader && styles.main,
        center && commonSty.center,
        !showHeader && commonSty.containerInset(topInset),
        containerStyle,
      ]}
      {...restProps}>
      {showHeader && <Header {...restProps} />}
      {children}
    </View>
  );
};

export default memo(Container);
