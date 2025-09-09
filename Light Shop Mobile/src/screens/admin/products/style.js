import {StyleSheet} from 'react-native';
import { COLORS } from '../../../theme/colors';
import { FONTS } from '../../../constants/fonts';
import { commonSty } from '../../../theme';
import { moderateScale } from 'react-native-size-matters';


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  smallContainer: {
    width: '10%',
    alignItems: 'center',
  },
  leftIconSubContainer: {
      ...commonSty.size(28),
      ...commonSty.center,
      borderRadius: moderateScale(15),
      ...commonSty.lightShadow,
    },
  searchBarContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBar: {
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    height: 45,
    width: '100%',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
  },
  searchInput:{
    fontSize:14,
    color:COLORS.APP_BLACK,
    fontFamily:FONTS.INTER_REGULAR,
    width:"80%"
  },
  filterInput:{
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    height: 45,
    width: '16%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 5,
    flexWrap: 'nowrap', // Prevent wrapping to keep in one row
  },

  categoryWrapper: {
    alignItems: 'center',
    flex: 1, // Equal distribution of space
    paddingHorizontal: 2, // Small padding between items
  },

  categoryItem: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  categoryIcon: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },

  categoryTitleContainer: {
    width: '100%',
    minHeight: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  flatListContainer: {
    paddingHorizontal: 5,
    marginTop: 20,
  },

  categoryRow: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop:20,
  },
   modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal:15,
    position: 'absolute',
    top:110,
    right:30
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color:COLORS.APP_BLACK
  },
  optionButton: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default styles;
