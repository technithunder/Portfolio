import {View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator} from 'react-native';
import React from 'react';
import {COLORS} from '../../config/colors';
import {Images} from '../../config';
import {FONTS} from '../../config/font';

const CommonButton = ({
  variant,
  leftIcon,
  btnText,
  rightIcon,
  onPress,
  style,
  rightIconStyle,
  leftIconStyle,
  btnTextStyle,
  isLoading
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        {
          backgroundColor:
            variant === 'contained' ? COLORS.APP_PRIMARY : COLORS.APP_WHITE,
        },
        style,
      ]}
      onPress={onPress}>
        {isLoading ? <ActivityIndicator size={16} color={COLORS.APP_WHITE}/> : (
          <>
      {leftIcon && (
        <Image
          source={leftIcon}
          style={{
            tintColor:
              variant === 'contained' ? COLORS.APP_WHITE : COLORS.APP_PRIMARY,
            height: 18,
            width: 18,
            leftIconStyle,
          }}
        />
      )}
      {btnText && (
        <Text
          style={[
            styles.txtUploadSelfie,
            {
              color:
                variant === 'contained' ? COLORS.APP_WHITE : COLORS.APP_PRIMARY,
            },
            btnTextStyle,
          ]}>
          {btnText}
        </Text>
      )}
      {rightIcon && (
        <Image
          source={rightIcon}
          style={{
            tintColor:
              variant === 'contained' ? COLORS.APP_WHITE : COLORS.APP_PRIMARY,
            height: 14,
            width: 14,
            rightIconStyle,
          }}
        />
      )}
          </>
        )}
    </TouchableOpacity>
  );
};

export default CommonButton;

const styles = StyleSheet.create({
  buttonContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.APP_PRIMARY,
    gap: 10,
    borderRadius: 12,
  },
  txtUploadSelfie: {
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
  },
});
