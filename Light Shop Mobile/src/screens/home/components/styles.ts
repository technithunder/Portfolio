import {StyleSheet} from 'react-native';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {colors, commonSty, WIDTH} from '../../../theme';

const styles = StyleSheet.create({
  categoryContainer: {
    ...commonSty.itemsCenter,
    ...commonSty.mv20,
  },
  mainSliderWidth: {
    width: WIDTH,
  },
  categoryImageContainer: {
    borderRadius: moderateScale(25),
    padding: moderateScale(2),
    height: moderateScale(45),
    width: moderateScale(45),
    ...commonSty.center,
  },
  carouselBgImageStyle: {
    height: moderateScale(170),
    width: WIDTH / 1,
    borderRadius: 20,
    ...commonSty.rowCenter,
    ...commonSty.ph20,
  },
  carouselSubContainerStyle: {
    width: '45%',
    ...commonSty.pl10,
  },
  carouselSideImageStyle: {
    width: WIDTH / 2.2,
    height: moderateScale(180),
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
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
  featureProductImageStyle: {
    height: moderateScale(160),
    width: moderateScale(126),
    borderRadius: moderateScale(5),
    zIndex: -999,
  },
  recommendedContainer: {
    ...commonSty.rowCenter,
    backgroundColor: colors.white,
    borderRadius: moderateScale(7),
    width: moderateScale(190),
    height: moderateScale(66),
    ...commonSty.mr15,
    elevation: moderateScale(0.4),
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    borderColor: colors.snowDrift,
    borderWidth: moderateScale(1.2),
  },
  recommendedImage: {
    ...commonSty.size(66),
    borderTopLeftRadius: moderateScale(7),
    borderBottomLeftRadius: moderateScale(7),
  },
  bannerContainer: {
    width: WIDTH,
    height: moderateScale(160),
    backgroundColor: colors.desertStorm,
    ...commonSty.mv30,
    ...commonSty.rowSpaceBetween,
  },
  bannerSubContainer: {
    width: WIDTH / 1.9,
    ...commonSty.itemsEnd,
  },
  bannerSideImage: {
    height: moderateScale(160),
    width: WIDTH / 2,
  },
  bodyHeaderContainer: {
    ...commonSty.rowSpaceBetween,
    ...commonSty.selfCenter,
    ...commonSty.mt10,
    ...commonSty.mb5,
    width: '90%',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: verticalScale(10),
    left: '40%',
    width: '30%',
    ...commonSty.rowSpaceBetween,
  },
  paginationItemContainer: {
    padding: moderateScale(2),
    borderRadius: moderateScale(10),
  },
  paginationItem: {
    ...commonSty.size(5),
    backgroundColor: colors.white,
    borderRadius: moderateScale(10),
  },
  topCollectionContainer: {
    backgroundColor: colors.desertStorm,
    width: WIDTH / 1.2,
    height: moderateScale(160),
    borderRadius: moderateScale(10),
    ...commonSty.center,
    ...commonSty.selfCenter,
    ...commonSty.mt15,
    ...commonSty.rowCenter,
  },
  topCollectionLeftContainer: {
    width: WIDTH / 2,
    ...commonSty.itemsEnd,
  },
  topCollectionRightContainer: {
    height: moderateScale(160),
    width: WIDTH / 2,
  },
  likeIconContainerStyle: {
    ...commonSty.size(27),
    borderRadius: moderateScale(25),
    ...commonSty.lightShadow,
    ...commonSty.center,
    position: 'absolute',
    zIndex: 999,
    top: moderateScale(10),
    right: moderateScale(10),
    paddingTop: moderateScale(2),
  },
  mainProductContainer: {
    ...commonSty.mr20,
    zIndex: -999,
  },
});
export default styles;
