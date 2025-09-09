import {
  Image,
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, {useState} from 'react';
import {DropdownProps} from 'react-native-element-dropdown/lib/typescript/components/Dropdown/model';
import {Dropdown} from 'react-native-element-dropdown';

import styles from './styles';
import {FormikProps, FormikValues} from 'formik';
import {moderateScale} from 'react-native-size-matters';
import Typography from '../Typo';
import {colors, commonSty} from '../../theme';

interface DropProps<T> extends DropdownProps<T> {
  container?: ViewStyle;
  title?: string;
  leftIcon?: ImageSourcePropType;
  formik: FormikProps<any>;
  name: string;
  titleStyle?: TextStyle;
  errSty?: any;
  country?: boolean;
  value?: any;
  labelField?: keyof T;
  valueField?: keyof T;
  onChange?: (item: T, index: number) => void;
  disable?: boolean;
  loading?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  subDropdownStyle?: StyleProp<ViewStyle>;
}

const DropDown = <T extends any>({
  title,
  container,
  leftIcon,
  formik,
  name,
  titleStyle,
  errSty,
  country,
  value,
  labelField = 'label' as keyof T,
  valueField = 'value' as keyof T,
  onChange,
  loading,
  disable,
  containerStyle,
  subDropdownStyle,
  ...DropProps
}: DropProps<T>) => {
  const {handleBlur, handleChange, values, errors, touched, handleSubmit} =
    formik;
  const [focus, setFocus] = useState(false);
  const resolvedLabelField = labelField || ('label' as keyof T);
  const resolvedValueField = valueField || ('value' as keyof T);
  interface MainValueTy {
    label: string;
    value: string;
  }

  const mainValue: MainValueTy = {
    label: name ? values[name]?.label : '',
    value: name ? values[name]?.label : '',
  };

  const error = errors[name];
  const errorMessage =
    error && typeof error === 'object' && 'label' in error && error?.label;
  const dynamicStyle = {
    borderBottomWidth: focus ? 1 : 0.4,
  };
  return (
    <View>
      <View style={[dynamicStyle, styles.containerStyle, containerStyle]}>
        {title && focus && (
          <Typography title={title} txtStyle={[titleStyle || {}]} size={12} />
        )}
        <Dropdown
          style={[
            styles.subDropdown,
            subDropdownStyle,
            // errors[name] && touched[name]
            //   ? {
            //       borderColor: colors.lightRed,
            //       borderWidth: 1,
            //     }
            //   : {},
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          renderLeftIcon={() => {
            return <></>;
          }}
          inputSearchStyle={styles.inputSearchStyle}
          itemTextStyle={styles.itemTextStyle}
          itemContainerStyle={[styles.itemContainerStyle, {}]}
          containerStyle={{marginTop: moderateScale(10)}}
          maxHeight={300}
          value={mainValue as T}
          labelField={resolvedLabelField}
          valueField={resolvedValueField}
          activeColor={colors.white}
          disable={loading ? loading : disable}
          iconColor={colors.transparent}
          onChangeText={() => handleChange(name)}
          onChange={item => {
            formik.setFieldValue(name, item);
          }}
          onFocus={() => {
            setFocus(true);
          }}
          onBlur={() => {
            handleBlur(name);
            setFocus(false);
          }}
          {...DropProps}
        />
      </View>
      {errorMessage ? (
        <Typography
          title={error?.value as string}
          txtStyle={[styles.error, errSty]}
        />
      ) : null}
    </View>
  );
};

export default DropDown;
