import React, {FC} from 'react';
import {TextField} from 'rn-material-ui-textfield';
import {colors, commonSty} from '../../theme';
import styles from './styles';
import {StyleProp, TextInputProps, View, ViewStyle} from 'react-native';
import {FormikProps} from 'formik';
import {moderateScale} from 'react-native-size-matters';
import {Typography} from '..';
import { FONTS } from '../../constants/fonts';

interface AnimatedTextFieldProps extends TextInputProps {
  inputContainerStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  label?: string;
  formik: FormikProps<any>;
  name: string;
  errSty?: StyleProp<ViewStyle>;
}

const AnimatedTextField: FC<AnimatedTextFieldProps> = props => {
  const {inputContainerStyle, containerStyle, label, formik, name, errSty} =
    props;

  const isError = name && formik.errors[name] && formik.touched[name];

  return (
    <View>
      <TextField
        textColor={colors.black}
        fontSize={moderateScale(16)}
        labelFontSize={moderateScale(16)}
        onChangeText={formik?.handleChange(name)}
        onBluer={formik?.handleBlur(name)}
        value={formik?.values[name]}
        errorColor={colors.red}
        label={label}
        inputContainerStyle={[styles.inputContainerStyle, inputContainerStyle]}
        containerStyle={containerStyle}
        labelTextStyle={styles.labelStyle}
        titleTextStyle={styles.labelStyle}
        tintColor={colors.hitGrey}
        baseColor={colors.quillGrey}
        {...props}
      />
      <View>
        {isError && (
          <Typography
            title={formik.errors[name] as string}
            txtStyle={[inputContainerStyle, errSty, styles.errorStyle,{fontFamily:FONTS.INTER_REGULAR}]}
          />
        )}
      </View>
    </View>
  );
};

export default AnimatedTextField;
