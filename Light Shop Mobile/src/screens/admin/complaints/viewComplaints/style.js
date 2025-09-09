import {StyleSheet} from 'react-native';
import {colors, COLORS} from '../../../../theme/colors';
import {FONTS} from '../../../../constants/fonts';
import {commonSty} from '../../../../theme';
import {moderateScale} from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    marginHorizontal: 20,
  },
  smallContainer: {
    width: '10%',
    alignItems: 'center',
  },
  leftIconSubContainer: {
    ...commonSty.size(28),
    ...commonSty.center,
    borderRadius: moderateScale(15),
    ...commonSty.lightShadow,
  },
  complaintCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    marginLeft: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  complaintContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#495057',
    lineHeight: 22,
    marginBottom: 16,
  },
  metaInfo: {
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
    width: 100,
  },
  metaValue: {
    fontSize: 14,
    color: '#495057',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  assignedStaff: {
    // flexDirection: 'row',
    // alignItems: 'flex-start',
    // flexWrap: 'wrap',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  staffContainer: {
    // flexDirection: 'column',
    // flex: 1,
  },
  staffItem: {
    marginBottom: 4,
  },
  staffLabel: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
    marginRight: 8,
    marginBottom: 8,
  },
  staffEmail: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  staffName: {
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  uploadButton: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: COLORS.APP_WHITE,
    borderWidth: 1,
    borderColor: COLORS.APP_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    marginTop: 10,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: colors.osloGrey,
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(16),
    backgroundColor: colors.white,
    justifyContent: 'center',
    marginTop: moderateScale(10),
  },
  updateButton: {
    backgroundColor: COLORS.APP_PRIMARY,
    height: 45,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 15,
  },
  inputField: {
    borderWidth: 1,
    borderColor: COLORS.APP_LIGHT_GRAY,
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 14,
    color: COLORS.APP_BLACK,
    marginTop: 16,
    fontFamily: FONTS.INTER_REGULAR,
  }
  ,dropdownPlaceholder: {
    color: COLORS.APP_GRAY,
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
  },
  dropdownSelectedText: {
    color: COLORS.APP_BLACK,
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
  },
  dropdownSearch: {
    color: COLORS.APP_BLACK,
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
  },
  dropdownIcon: {
    width: 20,
    height: 20,
  },
  
  dropdown:{
    height:50
  },
});

export default styles;
