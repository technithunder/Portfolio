import { StyleSheet } from 'react-native'
import { FONTS, HEIGHT, WIDTH } from '../../helper/constants';
export default StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  messageList: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  imgmassage: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    borderRadius: 50
  },
  txtName: {
    fontFamily: FONTS.BOOK,
    fontSize: 20,
    fontWeight: "400",
    color: "#000000"
  },
  textCaption: {
    fontSize: 14,
    fontFamily: FONTS.BOOK,
    color: 'darkgray',
    marginTop: 5
  },

  headerMain: {
    marginTop: Platform.OS == 'ios' ? 40 : 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerBorder: {
    backgroundColor: '#96F280',
    height: 5,
    width: 38,
    marginRight: 20
  },
  mainHeaderText: {
    fontSize: 38,
    fontFamily: FONTS._BOLD,
  },
  upgradeToPro: {
    height: 50,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15
  },
  txtUpgradetopro: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: FONTS.BOOK,
  },

})