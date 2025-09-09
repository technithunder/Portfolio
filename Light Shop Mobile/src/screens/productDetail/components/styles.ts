import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {colors, commonSty, WIDTH} from '../../../theme';

const styles = StyleSheet.create({
  paginatedDotStyle: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(10),
    backgroundColor: colors.quillGrey,
  },
  paginatedActiveDotStyle: {
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  paginatedContainerStyle: {
    gap: moderateScale(10),
    marginBottom: moderateScale(10),
  },
  headerImageContainer: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    ...commonSty.size(26),
    ...commonSty.center,
  },
  sizeContainer: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    ...commonSty.center,
    ...commonSty.mr10,
  },
  colorContainer: {
    borderRadius: moderateScale(14),
    elevation: moderateScale(2),
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: moderateScale(2),
    ...commonSty.size(28),
    ...commonSty.mr10,
  },
  addCartContainer: {
    backgroundColor: colors.primary,
    width: WIDTH,
    height: moderateScale(70),
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: moderateScale(25),
    borderTopRightRadius: moderateScale(25),
    ...commonSty.center,
    ...commonSty.pv10,
    ...commonSty.flexRow,
  },
  carouselImageContainer: {
    width: WIDTH / 1.1,
    height: moderateScale(220),
    borderRadius: moderateScale(20),
  },
  carouselImageStyle: {
    borderRadius: moderateScale(20),
    width: WIDTH / 1.1,
    height: moderateScale(220),
  },
  productCarouselMainContainer: {
    width: WIDTH / 1.1,
    marginLeft: moderateScale(15),
  },
  productPaginationContainer: {
    bottom: moderateScale(-22),
  },
});
export default styles;
