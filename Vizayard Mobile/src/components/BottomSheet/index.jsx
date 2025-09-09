import React, {useCallback, useMemo, useRef} from 'react';
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from '@gorhom/bottom-sheet';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CommonBottomSheet = ({
  submitLoading,
  bottomSheetRef,
  handleSheetChanges,
  onPressPDF,
  onPressImage,
  heading,
  descriptions,
}) => {
  const snapPoints = useMemo(() => ['25%', '35%'], []);
  const insets = useSafeAreaInsets();

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      detached={false}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      style={styles.bottomSheetStyle}
      backdropComponent={renderBackdrop}
      android_keyboardInputMode="adjustResize"
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      // Remove bottomInset to avoid double spacing
      // bottomInset={insets.bottom}
      topInset={0}
    >
      <BottomSheetView style={styles.bottomSheetContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.bottomSheetTitle}>{heading}</Text>
          <Text style={styles.bottomSheetSubtitle}>{descriptions}</Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.option,
                submitLoading && styles.optionDisabled
              ]}
              onPress={onPressPDF}
              disabled={submitLoading}
              activeOpacity={0.7}>
              <MaterialIcons
                name="picture-as-pdf"
                size={40}
                color={submitLoading ? COLORS.APP_GRAY : COLORS.APP_PRIMARY_MAIN}
              />
              <Text
                style={[
                  styles.optionText,
                  {color: submitLoading ? COLORS.APP_GRAY : COLORS.APP_BLACK},
                ]}>
                Choose PDF
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                submitLoading && styles.optionDisabled
              ]}
              onPress={onPressImage}
              disabled={submitLoading}
              activeOpacity={0.7}>
              <MaterialIcons
                name="photo-library"
                size={40}
                color={submitLoading ? COLORS.APP_GRAY : COLORS.APP_PRIMARY_MAIN}
              />
              <Text
                style={[
                  styles.optionText,
                  {color: submitLoading ? COLORS.APP_GRAY : COLORS.APP_BLACK},
                ]}>
                Choose Image
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Add safe area padding only at the bottom */}
        <View style={{height: insets.bottom}} />
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: COLORS.APP_GRAY_LIGHT || '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: COLORS.APP_DIVIDER || '#E0E0E0',
    width: 40,
    height: 4,
  },
  bottomSheetStyle: {
    // Add shadow for iOS
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  bottomSheetContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    // Remove paddingBottom from here
  },
  contentContainer: {
    flex: 1,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontFamily: FONTS.INTER_BOLD || FONTS.INTER_MEDIUM,
    color: COLORS.APP_BLACK,
    textAlign: 'center',
    marginBottom: 5,
  },
  bottomSheetSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_GRAY || '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  option: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    backgroundColor: COLORS.APP_LIGHT_GRAY || '#F8F9FA',
    minWidth: 120,
    borderWidth: 1,
    borderColor: COLORS.APP_BORDER || '#E8E8E8',
  },
  optionText: {
    marginTop: 8,
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: 14,
    color: COLORS.APP_BLACK,
    textAlign: 'center',
  },
});

export default CommonBottomSheet;