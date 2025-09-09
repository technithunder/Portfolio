import {StyleSheet} from 'react-native';
import {moderateVerticalScale} from 'react-native-size-matters';
import {FONTS} from '../../constants/fonts';
import { COLORS } from '../../theme/colors';

const styles = StyleSheet.create({
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop:10,
  },
  card: {
    width: '48%',
    borderRadius: 16,
    marginBottom: 16,
    height: 100,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  recentActivityContainer: {
    marginTop: 20,
    marginHorizontal: 16,
    marginBottom:50
  },
  sectionTitle: {
    fontSize: moderateVerticalScale(18),
    fontFamily: FONTS.INTER_SEMIBOLD,
    color:COLORS.APP_BLACK,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    height:60,
    marginBottom: 10,
    marginTop: 10,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingHorizontal: 10,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  activityIconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  activityDetails: {
    flex: 1,
  },
  activityText: {
    fontSize: moderateVerticalScale(12),
    fontFamily: FONTS.INTER_REGULAR,
    color: '#000',
  },
  activityTime: {
    fontSize: moderateVerticalScale(10),
    fontFamily: FONTS.INTER_REGULAR,
    color:COLORS.APP_GRAY,
    marginTop: 4,
  },
  arrowContainer: {
    backgroundColor: '#4BAED5',
    height: '100%',
    width: 40,
    position: 'absolute',
    right: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: 28,
    color: 'white',
  },
   loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // High z-index to ensure it's on top
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Inter-Medium', // Adjust font family as per your theme
  },
  txtView:{
    color:COLORS.APP_PRIMARY,
    textDecorationLine:"underline",
    fontFamily:FONTS.INTER_MEDIUM
  },
 animatedCard: {
  backgroundColor: COLORS.APP_WHITE,
  borderWidth: 1,
  borderColor: COLORS.APP_LIGHT_GRAY, // subtle border color
  borderRadius: 12, // slightly softer corners
  padding: 12,
  marginTop: 12,
  shadowColor: '#000', // light shadow for depth
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2, // Android shadow
},
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.APP_LIGHT_GRAY + '10', 
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_GRAY,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: FONTS.INTER_MEDIUM,
    color: COLORS.APP_BLACK,
    flex: 1,
    textAlign: 'right',
  },
});

export default styles;
