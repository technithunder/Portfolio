import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FONTS} from '../../constants/fonts';
import {COLORS} from '../../theme/colors';

const LinearButton = ({
  title,
  onPress,
  style,
  textStyle,
  colors = ['#00ABDC', '#01467A'],
  start = {x: 0, y: 0},
  end = {x: 1, y: 0},
  disabled = false,
  gradientStyle,
  loading,
  loadingColor = '#FFF',
  ...props
}) => {
  console.log('LinearButton rendered with title:', typeof loading);
  return (
    <LinearGradient
      colors={disabled ? ['#CCCCCC', '#999999'] : colors}
      start={start}
      end={end}
      style={[styles.container, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled}
        style={[styles.gradient, gradientStyle]}
        {...props}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={COLORS.APP_WHITE}
              style={styles.loadingIndicator}
            />
          </View>
        ) : (
          <Text style={[styles.text, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    backgroundColor: 'red',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  text: {
    color: COLORS.APP_WHITE,
    fontSize: 22,
    textAlign: 'center',
    fontFamily: FONTS.INTER_REGULAR,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    marginRight: 8,
  },
});

export default LinearButton;
