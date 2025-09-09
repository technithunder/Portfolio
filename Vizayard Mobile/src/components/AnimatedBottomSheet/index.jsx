import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomDrawer from '../BottomDrawer';
import {COLORS} from '../../config/colors';
import { FONTS } from '../../config/font';

const AnimatedBottomSheet = ({visible, onClose, heading, subHeading,onPressPDFPicker,onPressImagePicker}) => {
  return (
    <BottomDrawer
      visible={visible}
      onClose={onClose}
      height={280}>
      <View style={styles.drawerContainer}>
        <Text style={styles.drawerTitle}>{heading}</Text>
        <Text style={styles.drawerSubtitle}>{subHeading}</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.option, styles.optionRow]}
            onPress={onPressPDFPicker}>
            <MaterialIcons
              name="picture-as-pdf"
              size={40}
              color={COLORS.APP_PRIMARY_MAIN}
            />
            <Text style={styles.optionText}>Choose PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, styles.optionRow]}
            onPress={onPressImagePicker}>
            <MaterialIcons
              name="photo-library"
              size={40}
              color={COLORS.APP_PRIMARY_MAIN}
            />
            <Text style={styles.optionText}>Choose Image</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomDrawer>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    padding: 20,
    width: '100%',
    // backgroundColor:"red",
    // alignItems:'flex-start'
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.APP_BLACK,
    marginBottom: 5,
    textAlign: 'center',
  },
  drawerSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_GRAY || '#666',
    textAlign: 'center',
    marginBottom: 20,
  },

  optionRow: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    backgroundColor: COLORS.APP_LIGHT_GRAY || '#F8F9FA',
    minWidth: 120,
    borderWidth: 1,
    borderColor: COLORS.APP_BORDER || '#E8E8E8',
    marginHorizontal: 10,
  },

  // Update your existing optionsContainer to handle the new layout
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    marginBottom: 0,
  },
  // optionsContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   marginTop: 10,
  // },
  option: {
    alignItems: 'center',
    padding: 10,
  },
  optionIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  optionText: {
    marginTop: 10,
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 14,
    color: COLORS.APP_BLACK,
  },
});

export default AnimatedBottomSheet;
