import {ImageSourcePropType, TextStyle, View, ViewStyle} from 'react-native';
import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';

import styles from './styles';
import {moderateScale} from 'react-native-size-matters';
import {COLORS} from '../../config/colors';
import {commonSty} from '../../theme';
import Typography from '../Typo';

interface DropProps<T> {
  container?: ViewStyle;
  title?: string;
  leftIcon?: ImageSourcePropType;
  titleStyle?: TextStyle;
  titleSize?: number;
  mainContainerSty?: ViewStyle;
  placeholder?: string;
  loading?: boolean;
}

const CustomDropdown = <T extends any>({
  title,
  container,
  leftIcon,
  titleStyle,
  titleSize,
  mainContainerSty,
  placeholder,
  loading,
  ...props
}: DropProps<T>) => {
  return (
    <View
      style={[
        
        mainContainerSty,
      ]}>
      {title && (
        <Typography
          title={title}
          txtStyle={[titleStyle || {}]}
          color={COLORS.APP_COMMON_BLACK}
          size={14}
        />
      )}

      <View
        style={[
          styles.dropdown,
          {borderColor: COLORS.APP_BORDER},
          commonSty.rowCenter2,
        ]}>
        <Dropdown
          style={[styles.subDropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          itemTextStyle={styles.itemTextStyle}
          itemContainerStyle={styles.itemContainerStyle}
          activeColor={COLORS.LIGHT_RED}
          placeholder={placeholder}
          disable={loading}
          // activeColor={colors.primaryDark}
          containerStyle={styles.containerStyle}
          {...props}
        />
      </View>
    </View>
  );
};

export default CustomDropdown;
