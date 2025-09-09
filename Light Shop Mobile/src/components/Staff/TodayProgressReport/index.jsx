import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {moderateVerticalScale, moderateScale} from 'react-native-size-matters';
import {FONTS} from '../../../constants/fonts';
import {COLORS} from '../../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../../constants';

const TodayProgressReport = ({
  progressData,
  isLoading,
  onClockIn,
  onClockOut,
  onToggleCheckbox,
  progressPercentage,
}) => {
  const navigation = useNavigation()
  const handleClockIn = async () => {
    const result = await onClockIn();
    if (result?.success) {
      Alert.alert('Clock In Successful', result.message);
    } else {
      Alert.alert('Clock In Failed', result?.message || 'An error occurred');
    }
  };

  const handleClockOut = async () => {
    const result = await onClockOut();
    if (result?.success) {
      Alert.alert('Clock Out Successful', result.message);
    } else {
      Alert.alert('Clock Out Failed', result?.message || 'An error occurred');
    }
  };

  const handleToggleCheckbox = async key => {
    const result = await onToggleCheckbox(key);
    if (!result?.success) {
      Alert.alert('Update Failed', result?.message || 'An error occurred');
    }
  };

  const getProgressColor = (timeValue, title) => {
    if (title === 'Daily Progress' && timeValue) {
      const percentage = parseInt(timeValue.replace('%', ''));
      if (percentage === 0) {
        return '#EF4444';
      } else if (percentage >= 1 && percentage <= 99) {
        return '#FFA500';
      } else if (percentage === 100) {
        return '#10B981';
      }
    }
    return timeValue ? COLORS.APP_PRIMARY : COLORS.APP_BLACK;
  };

  const CheckboxItem = ({title, isChecked, onToggle, disabled}) => (
    <View style={styles.progressItem}>
      <Text style={[styles.progressTitle, disabled && styles.disabledText]}>
        {title}
      </Text>
      <TouchableOpacity
        style={[
          styles.checkbox,
          isChecked && styles.checkedBox,
          disabled && styles.disabledCheckbox,
        ]}
        onPress={onToggle}
        disabled={disabled || isLoading}>
        {isChecked && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    </View>
  );

  const TimeItem = ({title, time}) => (
    <View style={styles.progressItem}>
      <Text style={styles.progressTitle}>{title}</Text>
      <Text
        style={[styles.progressStatus, {color: getProgressColor(time, title)}]}>
        {time || '--:--'}
      </Text>
    </View>
  );

  const ClockButton = ({title, onPress, disabled, color}) => (
    <TouchableOpacity
      style={[
        styles.clockButton,
        {backgroundColor: disabled ? COLORS.LIGHT_GRAY || '#E5E7EB' : color},
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}>
      <Text
        style={[
          styles.clockButtonText,
          {
            color: disabled
              ? COLORS.GRAY || '#6B7280'
              : COLORS.WHITE || '#FFFFFF',
          },
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const isClockInDisabled = !!progressData.staffInTime;
  const isClockOutDisabled =
    !progressData.staffInTime || !!progressData.staffOutTime;


  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
      <Text style={styles.sectionTitle}>Today's Progress</Text>
      <TouchableOpacity onPress={() => navigation.navigate(Routes.ProgressReport)}>
        <Text style={styles.txtViewReports}>View full report</Text>
      </TouchableOpacity>
      </View>

      <View style={styles.clockButtonsContainer}>
        <ClockButton
          title="Clock In"
          onPress={handleClockIn}
          disabled={isClockInDisabled}
          color={COLORS.SUCCESS || '#10B981'}
        />
        <ClockButton
          title="Clock Out"
          onPress={handleClockOut}
          disabled={isClockOutDisabled}
          color={COLORS.ERROR || '#EF4444'}
        />
      </View>

      <View style={styles.progressContainer}>
        <TimeItem title="Staff In-Time" time={progressData.staffInTime} />

        <CheckboxItem
          title="Lead Checked"
          isChecked={progressData.leadChecked}
          onToggle={() => handleToggleCheckbox('leadChecked')}
          disabled={isClockOutDisabled}
        />

        <CheckboxItem
          title="Lead Followed"
          isChecked={progressData.leadFollowed}
          onToggle={() => handleToggleCheckbox('leadFollowed')}
          disabled={isClockOutDisabled}
        />

        <CheckboxItem
          title="Tomorrow's Tasks Checked"
          isChecked={progressData.tomorrowTasksChecked}
          onToggle={() => handleToggleCheckbox('tomorrowTasksChecked')}
          disabled={isClockOutDisabled}
        />

        <CheckboxItem
          title="Reporting Sheet Sent"
          isChecked={progressData.reportingSheetSent}
          onToggle={() => handleToggleCheckbox('reportingSheetSent')}
          disabled={isClockOutDisabled}
        />

        <TimeItem title="Staff Out-Time" time={progressData.staffOutTime} />

        <View style={styles.divider}/>

        <TimeItem title="Daily Progress" time={`${progressPercentage}%`} />
      </View>
    </View>
  );
};

export default TodayProgressReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: moderateVerticalScale(18),
    fontFamily: FONTS.INTER_SEMIBOLD,
    color: COLORS.APP_BLACK,
  },
  clockButtonsContainer: {
    flexDirection: 'row',
    gap: moderateScale(12),
    marginBottom: moderateVerticalScale(16),
    marginTop:16
  },
  clockButton: {
    flex: 1,
    paddingVertical: moderateVerticalScale(12),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockButtonText: {
    fontSize: moderateVerticalScale(14),
    fontFamily: FONTS.INTER_SEMIBOLD,
    fontWeight: '600',
  },
  progressContainer: {
    gap: moderateVerticalScale(12),
  },
  progressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: moderateVerticalScale(2),
  },
  progressTitle: {
    fontSize: moderateVerticalScale(14),
    fontFamily: FONTS.INTER_MEDIUM || FONTS.INTER_REGULAR,
    color: COLORS.APP_BLACK,
    flex: 1,
  },
  progressStatus: {
    fontSize: moderateVerticalScale(13),
    fontFamily: FONTS.INTER_SEMIBOLD,
    fontWeight: '600',
  },
  checkbox: {
    width: moderateScale(16),
    height: moderateScale(16),
    borderWidth: 2,
    borderColor: COLORS.APP_PRIMARY,
    borderRadius: moderateScale(4),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.APP_WHITE,
  },
  checkedBox: {
    backgroundColor: COLORS.APP_PRIMARY,
    borderColor: COLORS.APP_PRIMARY,
  },
  disabledCheckbox: {
    borderColor: COLORS.LIGHT_GRAY || '#E5E7EB',
    backgroundColor: COLORS.LIGHT_GRAY || '#E5E7EB',
  },
  checkmark: {
    color: COLORS.APP_WHITE,
    fontSize: moderateVerticalScale(10),
    fontWeight: 'bold',
  },
  disabledText: {
    color: COLORS.GRAY || '#6B7280',
  },
  divider:{
    height:1,width:"100%",backgroundColor:"#E5E7EB"
  },
  txtViewReports:{
    color:COLORS.APP_PRIMARY,
    fontFamily:FONTS.INTER_REGULAR,
    textDecorationLine:"underline"
  }
});
