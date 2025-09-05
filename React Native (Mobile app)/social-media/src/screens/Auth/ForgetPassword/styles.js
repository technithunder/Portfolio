import { StyleSheet } from 'react-native';
import { FONTS, HEIGHT, WIDTH, hp, wp } from '../../../helper/constants';

export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  bgImage: {
    height: hp('30%'),
    width: wp('70%'),
    resizeMode: 'stretch',
  },
  title: {
    fontSize: hp('8%'),
    position: 'absolute',
    top: hp('15%'),
    left: wp('22%'),
    fontFamily: FONTS._BOLD,
  },
  loginBody: {
    flex: 1,
    paddingHorizontal: 35,
  },
  signupText: {
    fontSize: hp('5%'),
    fontFamily: FONTS.BOOK,
    marginTop: hp('2%'),
  },
  emailInput: {
    backgroundColor: '#F5F5F5',
    paddingVertical: hp('2.5%'),
    paddingLeft: 50,
    borderRadius: 50,
    fontFamily: FONTS.BOOK,
    marginTop: hp('3%'),
  },
  signupBtn: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: hp('2.2%')
  },
  btnInner: {
    paddingVertical: hp('1.6%'),
    paddingHorizontal: 34,
    borderRadius: 50,
  },
  btnText: {
    fontFamily: FONTS.BOOK,
    fontSize: 18,
  },
  btnLogin: {
    fontFamily: FONTS.BOOK,
    fontSize: 18,
    marginBottom: 70,
    marginTop: 20,
    textAlign: 'center',
  },
  fbBtn: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 54,
    paddingVertical: hp('1.9%'),
    flexDirection: 'row',
    borderRadius: 50,
  },
  fbLogo: {
    width: 10,
    height: 22,
    resizeMode: "contain",
    marginRight: 24
  },
  bodyContainer2: {
    flex: 1,
    justifyContent: 'space-between',
  },
  divider: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: hp('5%')
  },
  orView: {
    padding: 9,
    borderRadius: 50,
    backgroundColor: '#C4C4C4',
    alignItems: 'center',
  },
  orText: {
    fontFamily: FONTS.BOOK,
    fontSize: 11
  },
  border: {
    width: WIDTH / 3,
    borderBottomColor: '#C4C4C4',
    borderBottomWidth: 1
  }
});
