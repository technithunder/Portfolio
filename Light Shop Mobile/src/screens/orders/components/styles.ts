import {StyleSheet} from 'react-native';
import {colors, commonSty, WIDTH} from '../../../theme';
import {moderateScale} from 'react-native-size-matters';

const styles = StyleSheet.create({
  tabBarWrapper: {
    width: '100%',
  },
  scrollViewStyle: {
    flexGrow: 0,
  },
  mainTabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(10),
    // Removed minWidth: WIDTH as it prevents proper scrolling
  },
  selectedTabContainer: {
    height: moderateScale(35),
    width: WIDTH / 3.5,
    borderRadius: moderateScale(20),
    position: 'absolute',
    backgroundColor: colors.gravel,
    alignItems: 'center',
    justifyContent: 'center',
    left: moderateScale(10), // Match the paddingHorizontal of parent
    // Removed right property as it conflicts with left + width
  },
  tabContainer: {
    height: moderateScale(35),
    width: WIDTH / 3.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: moderateScale(2), // Add small margin for better spacing
  },
  orderCardContainer: {
    width: WIDTH - moderateScale(40), // Better approach: full width minus margins
    // Alternative: width: '90%', for responsive width
    height: moderateScale(180),
    alignSelf: 'center', // Center the card
    ...commonSty.mt30,
    borderRadius: moderateScale(10),
    ...commonSty.p20,
    borderColor: colors.snowDrift,
    borderWidth: moderateScale(1.5),
    elevation: moderateScale(0.3),
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: colors.white,
  },
});

export default styles;