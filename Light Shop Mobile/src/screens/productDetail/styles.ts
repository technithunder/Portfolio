import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {colors, commonSty, HEIGHT} from '../../theme';

const styles = StyleSheet.create({
  headerImageContainer: {
    borderRadius: moderateScale(20),
    ...commonSty.size(26),
    ...commonSty.center,
    ...commonSty.lightShadow,
  },
  headerContainer: {
    ...commonSty.rowSpaceBetween,
    ...commonSty.mh20,
    ...commonSty.mt10,
  },
  border: {
    borderBottomColor: colors.aquaHaze,
    borderBottomWidth: moderateScale(1.5),
    ...commonSty.mv15,
  },
  scrollMainContainer: {
    ...commonSty.pb100,
    backgroundColor: colors.white,
    borderTopRightRadius: moderateScale(35),
    borderTopLeftRadius: moderateScale(35),
    flexGrow: 1,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  bodyContainer: {
    ...commonSty.mt10,
    ...commonSty.ph20,
    borderTopRightRadius: moderateScale(35),
    borderTopLeftRadius: moderateScale(35),
  },
  bodyColorSizeContainer: {
    width: '48%',
    height: moderateScale(65),
  },
  bodyScrollContainer: {
    paddingBottom: HEIGHT / 2.2,
  },
});
export default styles;
