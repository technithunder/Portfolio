import {StyleSheet} from 'react-native';
import {COLORS} from '../../theme/colors';
import {FONTS} from '../../constants/fonts';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
    paddingHorizontal: 16,
    position: 'relative',
  },
  backButton: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: COLORS.APP_WHITE,
    shadowColor: COLORS.APP_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  productCard: {
    backgroundColor: COLORS.APP_WHITE,
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    shadowColor: COLORS.APP_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 2,
  },
  divider: {
    height: 2,
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    marginVertical: 6,
  },
  inputOrderTrack: {
    borderWidth: 1,
    borderColor: COLORS.APP_LIGHTER_GRAY,
    borderRadius: 10,
    padding: 10,
    color: COLORS.APP_BLACK,
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
  },
  detailsButton: {
    width: '35%',
    borderRadius: 10,
    backgroundColor: COLORS.APP_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  uploadPhoto: {
    borderWidth: 1,
    borderColor: COLORS.APP_GRAY,
    borderRadius: 10,
    padding: 10,
    height:45,
    backgroundColor: COLORS.APP_WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  editButton: {
    width: '26%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.APP_BLACK,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  txtAddReview: {
    fontSize: 12,
    marginTop:8,
    fontFamily: FONTS.INTER_MEDIUM,
    color: COLORS.APP_PRIMARY,
    textDecorationLine: 'underline',
  },
   ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 20,
  },
});

export default styles;
