import {Dimensions, StyleSheet} from 'react-native';
import {commonSty} from '../../../../theme';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {COLORS} from '../../../../config/colors';

export const HEIGHT = Dimensions.get('window').height;
export const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  categoryContainer: {
    ...commonSty.itemsCenter,
    ...commonSty.mv20,
  },
  mainSliderWidth: {
    width: WIDTH,
    marginTop: moderateScale(20),
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
    ...commonSty.ph10,
  },
  carouselSubContainerStyle: {
    width: '100%',
    height: moderateScale(140),
    // borderRadius: 20,
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
    backgroundColor: COLORS.APP_GRAY,
  },
  paginatedActiveDotStyle: {
    overflow: 'hidden',
    backgroundColor: COLORS.APP_PRIMARY_MAIN,
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
    backgroundColor: COLORS.APP_COMMON_WHITE,
    borderRadius: moderateScale(7),
    width: moderateScale(190),
    height: moderateScale(66),
    ...commonSty.mr15,
    elevation: moderateScale(0.4),
    shadowColor: COLORS.APP_COMMON_WHITE,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    borderColor: COLORS.APP_BORDER,
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
    backgroundColor: COLORS.APP_BORDER,
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
    backgroundColor: COLORS.APP_COMMON_WHITE,
    borderRadius: moderateScale(10),
  },
  topCollectionContainer: {
    backgroundColor: COLORS.APP_BORDER,
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
  buttonContainer: {
    position: 'absolute',
    bottom: moderateScale(20),
    left: 0,
    right: 0,
  },
  firstSlideButton: {
    backgroundColor: COLORS.APP_PRIMARY,
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(25),
    width: moderateScale(120),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLORS.APP_WHITE || '#FFFFFF', // Background for first slide
  },
  aboutUsCard: {
    backgroundColor: COLORS.APP_PRIMARY_MAIN,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10, // For Android shadow
    height: moderateScale(170),
    width: WIDTH / 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default styles;
