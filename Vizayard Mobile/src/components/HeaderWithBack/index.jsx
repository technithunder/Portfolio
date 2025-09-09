import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';
import Icon from '../VectorIcon';
import {moderateScale} from 'react-native-size-matters';

const HeaderWithBack = ({onBack, title, rightIcon, onRightPress}) => {
  return (
    <View style={styles.headerContainer}>
      {/* Left Icon */}
      {onBack ? (
        <View style={styles.leftIconContainer}>
          <Icon
            name="arrow-back"
            icon="Ionicons"
            color={COLORS.APP_BLACK}
            size={24}
            onPress={onBack}
          />
        </View>
      ) : (
        <View style={styles.placeholder} />
      )}

      {/* Title */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* Right Icon */}
      {rightIcon ? (
        <TouchableOpacity
          style={styles.rightIconContainer}
          onPress={onRightPress}>
          <Image
            source={rightIcon}
            style={{height: 22, width: 22, resizeMode: 'contain'}}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: moderateScale(16),
    height: moderateScale(50),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftIconContainer: {
    padding: moderateScale(6),
    borderRadius: moderateScale(20),
  },
  rightIconContainer: {
    padding: moderateScale(6),
    borderRadius: moderateScale(20),
  },
  placeholder: {
    width: moderateScale(30), // ensures title stays centered
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: moderateScale(22),
    fontFamily: FONTS.INTER_BOLD,
    color: COLORS.APP_BLACK,
  },
});

export default HeaderWithBack;
