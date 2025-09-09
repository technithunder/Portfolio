import React, {FunctionComponent, useState} from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {FormikProps, FormikValues} from 'formik';
import Typography from '../Typo';
import styles from './styles';
import {moderateScale} from 'react-native-size-matters';
import {commonSty} from '../../theme';
import {COLORS} from '../../config/colors';

interface InputProps extends TextInputProps {
  mainContainer?: ViewStyle;
  tit?: string;
  titleStyle?: TextStyle;
  title?: string;
  errTitle?: string;
  errors?: string;
  touched?: string;
  RightIconStyle?: ImageStyle;
  RightIconSource?: ImageSourcePropType;
  rightIconPress?: (e: GestureResponderEvent) => void;
  leftIcon?: ImageSourcePropType;
  iconStyle?: ImageStyle;
  inputContainerStyle?: ViewStyle;
  textInputStyle?: StyleProp<ViewStyle>;
  RightIcon?: string;
  isHide?: boolean;
  formik: FormikProps<any>;
  name?: keyof FormikValues;
  mt?: number;
  errSty?: any;
  titleContainer?: ViewStyle;
}

const TextField: FunctionComponent<InputProps> = Props => {
  const {
    mainContainer,
    leftIcon,
    iconStyle,
    inputContainerStyle,
    title,
    titleStyle,
    textInputStyle,
    name,
    formik,
    mt,
    errSty,
  } = Props;

  const [focus, setFocus] = useState<boolean>(false);
  const {handleBlur, handleChange, values, errors, touched} = formik;

  const isError = name && errors[name] && touched[name];

  const dynamicBorder = {
    borderColor: isError ? COLORS.APP_RED : COLORS.APP_COMMON_PLACEHOLDER,
  };

  return (
    <View
      style={[
        {marginTop: mt ? moderateScale(mt) : moderateScale(20)},
        mainContainer,
      ]}>
      {title && (
        <Typography
          title={title}
          txtStyle={[titleStyle || {}]}
          size={15}
          mb={10}
          ml={2}
        />
      )}
      <View
        style={[
          styles.inputContainerStyle,
          inputContainerStyle,
          dynamicBorder,
        ]}>
        {leftIcon && (
          <Image
            source={leftIcon}
            style={[styles.iconStyle, iconStyle]}
            resizeMode="contain"
          />
        )}
        <TextInput
          style={[styles.textInputStyle, textInputStyle]}
          onChangeText={handleChange(name)}
          onBlur={() => {
            handleBlur(name);
            setFocus(false);
          }}
          onFocus={() => setFocus(true)}
          placeholder={title}
          placeholderTextColor={COLORS.DOVY_GREY}
          value={name ? values[name] : ''}
          {...Props}
        />
      </View>
      <View>
        {isError && (
          <Typography
            title={errors[name] as string}
            txtStyle={[commonSty.error, errSty]}
          />
        )}
      </View>
    </View>
  );
};

export default TextField;
