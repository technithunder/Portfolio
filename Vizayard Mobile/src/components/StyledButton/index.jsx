import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {hapticOption} from '../../utils';

const StyledButton = ({
  title = 'Button',
  onPress,
  isLoading = false,
  disabled = false,
  style = {},
  textStyle = {},
}) => {
  const handlePress = () => {
 
    ReactNativeHapticFeedback.trigger('impactMedium', hapticOption);
    if (!!onPress) {
      onPress();
    }
  };
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        disabled && {
          backgroundColor: COLORS.APP_GRAY_100,
          borderColor: COLORS.APP_GRAY_100,
        },
      ]}
      onPress={handlePress}
      disabled={disabled || isLoading}
      activeOpacity={isLoading ? 1 : 0.7}>
      {isLoading ? (
        <ActivityIndicator size="small" color={COLORS.APP_COMMON_WHITE} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default StyledButton;

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 45,
    borderRadius: 10,
    backgroundColor: COLORS.APP_PRIMARY_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.GREY,
  },
  text: {
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: 16,
    lineHeight: 24.2,
    color: COLORS.APP_WHITE,
    textAlign: 'center',
  },
});
