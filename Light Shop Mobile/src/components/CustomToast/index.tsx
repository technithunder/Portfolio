import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from '../VectorIcon';
import Typography from '../Typo';
import {moderateScale} from 'react-native-size-matters';
import { COLORS } from '../../theme/colors';

const toastTypeStyles = {
  success: {
    icon: 'checkmark-circle',
    color: '#22C55E', // green
    bgColor: '#DCFCE7',
  },
  info: {
    icon: 'information-circle',
    color: '#3B82F6', // blue
    bgColor: '#DBEAFE',
  },
  warning: {
    icon: 'alert-circle',
    color: '#F59E0B', // orange
    bgColor: '#FEF3C7',
  },
  error: {
    icon: 'close-circle',
    color: '#EF4444', // red
    bgColor: '#FECACA',
  },
};

const CustomToast = (props: any) => {
  const {icon, color, bgColor} = toastTypeStyles[props?.type] || {};
  const {text1, text2, onPressClose} = props;

  return (
    <View style={[styles.toastContainer, {backgroundColor: bgColor}]}>
      <Icon icon="Ionicons" name={icon} size={20} color={color} />
      <View style={styles.message}>
        <Typography title={text1} numberOfLines={1} size={14} />
        {text2 && <Typography title={text2} numberOfLines={1} size={12} />}
      </View>
      <Icon
        icon="Ionicons"
        name="close"
        size={18}
        color={COLORS.APP_GRAY}
        onPress={onPressClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 16,
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '90%',
    height: moderateScale(50),
  },
  message: {
    width: '80%',
    textAlign: 'left',
  },
});

export default CustomToast;
