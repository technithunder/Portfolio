import {StyleSheet} from 'react-native';
import {COLORS} from '../../../theme/colors';
import {FONTS} from '../../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  inputView: {
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    height: 40,
    marginHorizontal: 20,
    borderRadius: 50,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchInput: {
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    width: 46,
    height: 46,
    backgroundColor: COLORS.APP_PRIMARY,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  card:{
    borderWidth:1,
    borderColor: COLORS.APP_LIGHT_GRAY,
    borderRadius: 10,
    padding: 16,
    marginTop:16,
    flexDirection: 'row',
    justifyContent: 'space-between',       
    alignItems: 'center',
  },
  chipView:{
    width:70,
    height:22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginTop:10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.APP_GRAY,
    fontFamily: FONTS.INTER_REGULAR,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  clearSearchButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.APP_LIGHT_GRAY,
  },

  // Results count
  resultCountContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },

  applyFilterbtn:{
    marginHorizontal:14,
    marginTop:25,
    height:40,
    width:110,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:16,
    backgroundColor:COLORS.APP_PRIMARY
  },
  txtapplyfilter:{
    color:COLORS.APP_WHITE,
    fontSize:14,
    fontFamily:FONTS.INTER_MEDIUM
  }
});

export default styles;
