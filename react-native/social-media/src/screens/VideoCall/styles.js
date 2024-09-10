import { StyleSheet } from "react-native"
import { FONTS, HEIGHT, hp, WIDTH, wp } from "../../helper/constants";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  callContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    paddingTop: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: "center",
    backgroundColor: "white",
  },
  button: {
    marginTop: 100,
  },
  localVideo: {
    flex: 1,
  },
  remoteGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  remoteVideo: {
    height: HEIGHT / 2,
    width: '100%'
  },
  optionsContainer: {
    alignItems: "center",
    backgroundColor: '#000'
  },
  iceBtn: {
    backgroundColor: '#fff',
    padding: wp('4%'),
    borderRadius: 100,
    borderColor: '#57B7EB',
    borderWidth: 4
  },
  iceCount: {
    position: 'absolute',
    backgroundColor: '#57B7EB',
    height: wp('6%'),
    width: wp('6%'),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    right: - wp('2%'),
    top: - wp('2%')
  },
  skipCount: {
    fontFamily: FONTS.BOOK,
    color: '#ffffff'
  },
  iceBreaker: {
    fontSize: 20,
    color: '#fff',
    flex: 1,
    fontFamily: FONTS._BOLD,
    marginRight: wp('5%')
  },
  userInfo: {
    zIndex: 999,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: hp('3%'),
    position: 'absolute',
    bottom: 20,
    right: 20,
    left: 20
  },
  skipBtn: {
    borderColor: '#FF2424',
    borderWidth: 2,
    borderRadius: wp('2%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: wp('1.5%'),
    marginRight: wp('3%')
  },
  skipCountBtn: {
    position: 'absolute',
    backgroundColor: '#FF2424',
    height: wp('6%'),
    width: wp('6%'),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    right: - wp('3%'),
    top: - wp('3%')
  },
  skipText: {
    fontSize: wp('5%'),
    textTransform: 'uppercase',
    color: '#FF2424',
    fontFamily: FONTS._BOLD
  },
  userName: {
    fontFamily: FONTS.BOOK,
    fontSize: wp('6%'),
    color: '#ffffff'
  },
  age: {
    fontFamily: FONTS.BOOK,
    fontSize: wp('4%'),
    color: '#ffffff'
  },
  header: {
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 20,
    left: 20,
    justifyContent: 'space-between'
  },
  timer: {
    fontSize: wp('7%'),
    marginLeft: 10,
    color: '#fff',
    fontFamily: FONTS.BOOK
  },
  cover: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#000',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('5%'),
    paddingVertical: wp('10%'),
    borderRadius: wp('5%'),
    width: WIDTH * 0.80,
  },
  modalText: {
    fontSize: wp('4%'),
    fontFamily: FONTS.BOOK,
    textAlign: 'center',
    marginTop: wp('8%')
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
  seemeeText: {
    fontFamily: FONTS.BOOK,
    marginLeft: 5
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
  callBtn: {
    borderRadius: 100,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'darkgray'
  }
});
