import {StyleSheet} from 'react-native';
import {COLORS} from '../../theme/colors';
import { FONTS } from '../../constants/fonts';

const styles = StyleSheet.create({
  container: {
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
    paddingBottom: 20,
  },
  // Rating Stars Styles
  ratingContainer: {
    marginTop: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  // New Emoji Styles
  emojiContainer: {
    marginTop: 16,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingEmoji: {
    fontSize: 22,
    textAlign: 'center',
    // Add animation or scale effect if needed
    transform: [{ scale: 1.1 }],
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  singleStarContainer: {
    position: 'relative',
    marginHorizontal: 2,
    width: 36,
    height: 36,
  },
  halfStarButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 18,
    height: 36,
    zIndex: 2,
  },
  fullStarButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 18,
    height: 36,
    zIndex: 2,
  },
  starIconContainer: {
    position: 'absolute',
    top: 2,
    left: 2,
    zIndex: 1,
  },
  invisibleTouchArea: {
    width: '100%',
    height: '100%',
  },
  ratingTextContainer: {
    marginTop: 4,
  },
  // Summary Input Styles
  summaryContainer: {
    marginBottom: 24,
  },
  summaryInput: {
    borderWidth: 1,
    borderColor: COLORS.APP_GRAY_LIGHT || '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_BLACK,
    minHeight: 100,
  },
  // Attachment Styles
  attachmentSection: {
    marginBottom: 24,
  },
  attachmentActions: {
    marginTop: 8,
  },
  attachmentContainer: {
    backgroundColor: COLORS.APP_PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtAddReview: {
    fontSize: 12,
    marginTop: 8,
    fontFamily: FONTS.INTER_MEDIUM,
    color: COLORS.APP_PRIMARY,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  // Submit Button Styles
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
   
    marginBottom: 20,
    marginTop: 10,
  },
});

export default styles;