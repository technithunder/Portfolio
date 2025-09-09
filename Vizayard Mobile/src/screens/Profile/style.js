import {StyleSheet} from 'react-native';
//relative path imports
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
 progressBackground: {
    backgroundColor: COLORS.APP_BORDER || '#E5E7EB',
    width: '100%',
    height: 10,
    borderRadius: 50,
    marginTop:10,
  },
  progressFill: {
    backgroundColor: COLORS.APP_PRIMARY_MAIN,
    height: '100%',
    borderRadius: 50,
  },
  txtProfileName: {
    color: COLORS.APP_BLACK,
    fontSize: 18,
    fontFamily: FONTS.INTER_SEMIBOLD,
  },
  txtProfileEmail: {
    color: COLORS.APP_GRAY,
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
  },
  txtTitle:{
    fontSize:14,
    color:COLORS.APP_BLACK,
    fontFamily:FONTS.INTER_MEDIUM
  },
  txtSubTitle:{
    fontSize:12,
    color:"#6B7280",
    fontFamily:FONTS.INTER_REGULAR
  },
  itemCard: {
    marginHorizontal: 2,
    backgroundColor: COLORS.APP_WHITE,
    borderRadius:10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 10,
    marginTop: 0,
    elevation: 1,
    marginBottom:16,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  txtProfile: {
    fontFamily: FONTS.INTER_BOLD,
    color: COLORS.APP_BLACK,
    fontSize: 22,
    marginTop: 16,
  },
  editIcon: {
    backgroundColor: '#F3F4F6',
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  card: {
    backgroundColor: COLORS.APP_WHITE,
    borderWidth: 1,
    borderColor: COLORS.APP_BORDER,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 10,
    borderRadius: 10,
    marginTop: 30,
    elevation: 1,
  },
 
  txtDesc: {
    marginTop: 10,
    fontSize: 12,
    color: COLORS.APP_GRAY,
    fontFamily: FONTS.INTER_REGULAR,
  },
  
  header: {
    backgroundColor: '#C4C4C4',
    height: 200,
    width: '100%',
  },
  
  profileSection: {
    alignItems: 'center',
    marginTop: -100, // Adjusted for circular progress bar
    paddingHorizontal: 20,
  },
  
  // Profile Image Container with Circular Progress
  profileContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  profileImageSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Circular Progress Bar Styles
  circularProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  circularProgress: {
    transform: [{ rotate: '0deg' }],
  },
  
  // Profile Image Wrapper (inside circular progress)
  profileImageWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 12, // Reduced gap
    left: 12,
    right: 12,
    bottom: 12,
  },
  
  profilePicture: {
    height: 60, 
    width: 60,
    borderRadius: 68,
    borderWidth: 2,
    borderColor: COLORS.APP_PRIMARY_MAIN,
    
  },
  
  // Loading and Default States
  loadingContainer: {
    backgroundColor: COLORS.APP_COMMON_PLACEHOLDER,
    height: 136, // Match profile picture size
    width: 136,
    borderRadius: 68,
    borderWidth: 3,
    borderColor: COLORS.APP_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.APP_COMMON_PLACEHOLDER,
    height: 136, // Match profile picture size
    width: 136,
    borderRadius: 68,
    borderWidth: 3,
    borderColor: COLORS.APP_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  defaultProfileContainer: {
    // backgroundColor: COLORS.APP_COMMON_PLACEHOLDER,
    height: 60, // Match profile picture size
    width: 60,
    borderRadius: 68,
    borderWidth: 1,
    borderColor: COLORS.APP_COMMON_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  defaultProfileImage: {
    height: 40, // Increased slightly to match new container size
    width: 40,
    
  },
  
  // Progress Percentage Text (below the circular progress)
  progressPercentageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.APP_PRIMARY || '#007AFF',
    fontFamily: FONTS.INTER_BOLD,
    marginTop: 10,
    textAlign: 'center',
  },
  
  // Edit Button
  editView: {
    backgroundColor: COLORS.APP_PRIMARY_MAIN,
    borderRadius: 50,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 8, // Adjusted position for new image size
    bottom: 35,
    borderWidth: 2,
    borderColor: COLORS.APP_WHITE,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  
  
  txtProfileUserName: {
    color: COLORS.APP_GRAY,
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    textAlign: 'center',
    marginTop: 5,
  },
  
  // Menu Items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 14,
    marginHorizontal: 20,
    paddingVertical: 5,
  },
  
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  menuIcon: {
    height: 24,
    width: 24,
  },
  
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginHorizontal: 20,
    paddingVertical: 5,
  },
  
  horizontalLine: {
    height: 1,
    backgroundColor: COLORS.APP_DIVIDER,
    marginHorizontal: 20,
  },
  
  txtItemTitle: {
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_BLACK,
  },

  // Bottom Drawer Styles
  drawerContainer: {
    padding: 20,
    width: '100%',
  },
  
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.APP_BLACK,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: FONTS.INTER_BOLD,
  },
  
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  
  option: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    minWidth: 100,
  },
  
  optionIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  
  optionText: {
    marginTop: 10,
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 14,
    color: COLORS.APP_BLACK,
    textAlign: 'center',
  },
});

export default styles;