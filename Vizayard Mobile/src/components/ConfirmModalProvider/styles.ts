import {moderateScale} from 'react-native-size-matters';
import {StyleSheet} from 'react-native';
import {COLORS} from '../../config/colors';
import {commonSty} from '../../theme';
import {WIDTH} from '../../theme/commSty';
import { FONTS } from '../../config/font';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.APP_WHITE,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(15),
    alignItems: 'center',
  },
  headerContainer: {
    ...commonSty.rowStart,
    width: '100%',
    ...commonSty.mv10,
  },
  body: {
    marginBottom: moderateScale(20),
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: WIDTH / 1.25,
  },
  iconContainer: {
    alignItems: 'flex-start',
    width: '100%',
  },
  btnStyle: {
      justifyContent: 'center',
      alignSelf: 'center',
      borderWidth: moderateScale(1),
    },
    btnTextStyle: {
      fontSize: moderateScale(16),
      fontFamily: FONTS.INTER_MEDIUM,
      textAlign: 'center',
    },
});

export default styles;
