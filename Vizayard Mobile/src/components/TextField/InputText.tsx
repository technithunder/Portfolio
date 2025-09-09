import React, {FunctionComponent, useRef, useState} from 'react';
import {
  Animated,
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
import {commonSty} from '../../theme';
import Icon from '../VectorIcon';
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
    isHide,
    name,
    formik,
    mt,
    errSty,
    RightIcon,
    rightIconPress,
    titleContainer,
  } = Props;

  const [pass, setPass] = useState(isHide);
  const [focus, setFocus] = useState<boolean>(false);

  const {handleBlur, handleChange, values, errors, touched} = formik;

  const handlePass = (e: GestureResponderEvent) => {
    if (RightIcon) {
      rightIconPress && rightIconPress(e);
    } else {
      setPass(!pass);
    }
  };

  return (
    <View
      style={[
        {marginTop: mt ? moderateScale(mt) : moderateScale(13)},
        mainContainer,
      ]}>
      {title && (
        <View style={[{width: '60%', marginLeft: 2}, titleContainer]}>
          <Typography
            title={title}
            txtStyle={[styles.titleStyle, titleStyle || {}]}
            size={12}
          />
        </View>
      )}
      <View
        style={[
          styles.inputContainerStyle,
          inputContainerStyle,
          {
            borderColor: focus ? COLORS.DOVY_GREY : 'lightgrey',
          },
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
          secureTextEntry={RightIcon ? false : pass}
          onChangeText={handleChange(name)}
          onBlur={() => {
            handleBlur(name);
            setFocus(false);
          }}
          placeholderTextColor={COLORS.DOVY_GREY}
          value={name ? values[name] : ''}
          {...Props}
        />
        {isHide && (
          <TouchableOpacity onPress={handlePass}>
            {/* <Image
              source={
                RightIcon ? RightIcon : pass ? images.eye_close : images.eye
              }
              style={[styles.RightIconStyle, RightIconStyle]}
              resizeMode="contain"
            /> */}
            <Icon name={pass ? 'eye' : 'eye-off'} icon="Ionicons" />
          </TouchableOpacity>
        )}
      </View>
      <View>
        {name
          ? errors[name] &&
            touched[name] && (
              <Typography
                title={errors[name] as string}
                txtStyle={[commonSty.error, errSty]}
              />
            )
          : null}
      </View>
    </View>
  );
};

export default TextField;
