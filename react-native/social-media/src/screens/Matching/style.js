import { StyleSheet, Platform } from 'react-native'
import { FONTS, HEIGHT, hp, WIDTH, wp } from '../../helper/constants';

export default StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  headerMain: {
    marginTop: Platform.OS == 'android' ? 15 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerBorder: {
    backgroundColor: '#96F280',
    height: 5,
    width: 38,
    marginRight: wp('4%')
  },
  mainHeaderText: {
    fontSize: hp('5%'),
    fontFamily: FONTS._BOLD,
  },
  txtUpgradetopro: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: FONTS.BOOK,
    marginHorizontal: 10,
    marginVertical: 10
  },
  linearLabel: {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  //circle layout
  circleMain: {
    width: wp('145%'),
    height: wp('145%'),
    borderColor: 'darkgray',
    borderWidth: 1,
    marginTop: -20,
    borderRadius: 500,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  circle1: {
    width: wp('105%'),
    height: wp('105%'),
    borderColor: 'darkgray',
    borderWidth: 1,
    borderRadius: 1000,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  circle2: {
    width: wp('65%'),
    height: wp('65%'),
    borderColor: 'darkgray',
    borderWidth: 1,
    borderRadius: 1000,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 80
  },
  centerButton: {
    height: wp('34%'),
    width: wp('34%'),
    alignItems: 'center',
    justifyContent: 'center'
  },
  dp: {
    height: wp('16%'),
    width: wp('16%'),
    borderRadius: 100,
    position: 'absolute',
    zIndex: 999,
  },
  loaderText: {
    fontSize: wp('3%'),
    marginTop: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: FONTS._BOLD,
  },
  img: {
    width: WIDTH * 0.8,
    height: 200,
    backgroundColor: '#fff',
    resizeMode: "contain",
    borderRadius: 10,
  },
  text: {
    fontFamily: FONTS._BOLD,
    marginTop: 20,
    fontSize: wp('4%'),
    textTransform: "uppercase",
    marginBottom: 20
  },
  btn: {
    backgroundColor: '#fff',
    width: WIDTH * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: wp('4%'),
    marginTop: 20,
  },
  btnText: {
    fontFamily: FONTS._BOLD,
    fontSize: wp('5%'),
    textTransform: "uppercase"
  },
  finalModal: {
    flex: 1,
    alignSelf: 'center',
  },
  divider: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: hp('4%')
  },
  orView: {
    padding: 9,
    borderRadius: 50,
    backgroundColor: '#C4C4C4',
    alignItems: 'center',
    marginHorizontal: wp('3%')
  },
  orText: {
    fontFamily: FONTS.BOOK,
    fontSize: 11,
  },
  border: {
    width: '30%',
    borderBottomColor: '#C4C4C4',
    borderBottomWidth: 1
  },
  innerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('5%'),
    paddingVertical: wp('10%'),
    borderRadius: wp('5%'),
    width: WIDTH * 0.80,
  },
  modalText: {
    fontSize: wp('5%'),
    fontFamily: FONTS.BOOK,
    textAlign: 'center',
    marginTop: wp('16%'),
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    marginHorizontal: 10
  },
  profileView: {
    height: wp('35%'),
    width: wp('35%'),
    padding: wp('1%'),
    borderRadius: 100,
    position: 'absolute',
    alignSelf: 'center',
    top: -wp('12.5%')
  },
  profile: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 100
  },
  seemeeText: {
    fontFamily: FONTS.BOOK,
    marginLeft: 5,
    fontSize: wp('5%'),
  },
  waitingText: {
    textAlign: 'center',
    fontFamily: FONTS.BOOK,
    marginTop: 7
  }
})