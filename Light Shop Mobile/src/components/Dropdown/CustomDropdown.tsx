import {ImageSourcePropType, TextStyle, View, ViewStyle} from 'react-native';
import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';

import styles from './styles';
import {moderateScale} from 'react-native-size-matters';
import {colors, commonSty} from '../../theme';
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
  dropDownContainerStyle?: ViewStyle;
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
  dropDownContainerStyle,
  ...props
}: DropProps<T>) => {
  return (
    <View
      style={[
        {
          marginTop: moderateScale(13),
        },
        mainContainerSty,
      ]}>
      {title && (
        <Typography
          title={title}
          txtStyle={[titleStyle || {}]}
          color={colors.black}
          size={14}
        />
      )}

      <View
        style={[styles.dropdown, commonSty.rowCenter2, dropDownContainerStyle]}>
        <Dropdown
          style={[styles.subDropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          itemTextStyle={styles.itemTextStyle}
          itemContainerStyle={styles.itemContainerStyle}
          activeColor={colors.white}
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
