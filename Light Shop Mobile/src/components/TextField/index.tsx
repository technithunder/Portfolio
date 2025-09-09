import React, {FunctionComponent, memo, useState} from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {FormikProps, FormikValues} from 'formik';
import Typography from '../Typo';
import styles from './styles';
import {moderateScale} from 'react-native-size-matters';
import {colors, commonSty, WIDTH} from '../../theme';
import Icon from '../VectorIcon';

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
  isPassword?: boolean;
}

const TextField: FunctionComponent<InputProps> = props => {
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
    isPassword,
  } = props;

  const [focus, setFocus] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(true);
  const {handleBlur, handleChange, values, errors, touched} = formik;

  const isError = name && errors[name] && touched[name];

  const dynamicBorder = {
    borderBottomColor: focus
      ? colors.primary
      : isError
      ? colors.red
      : colors.quillGrey,
  };
  const dynamicInputContainerStyle = {
    width:
      leftIcon && isPassword
        ? WIDTH / 1.4
        : leftIcon
        ? WIDTH / 1.3
        : isPassword
        ? WIDTH / 1.2
        : WIDTH / 1.15,
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          style={[
            styles.textInputStyle,
            textInputStyle,
            dynamicInputContainerStyle,
          ]}
          onChangeText={handleChange(name)}
          onBlur={() => {
            handleBlur(name);
            setFocus(false);
          }}
          onFocus={() => setFocus(true)}
          placeholder={title}
          secureTextEntry={isPassword && showPassword}
          placeholderTextColor={colors.black}
          value={name ? values[name] : ''}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              icon="Ionicons"
              size={22}
              onPress={togglePasswordVisibility}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
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

export default memo(TextField);
