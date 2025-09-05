import { Platform, StyleSheet } from 'react-native'
import { FONTS, HEIGHT, WIDTH } from '../../helper/constants';
export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  headerMain: {
    marginTop: Platform.OS == 'ios' ? 40 : 15,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  txtusername: {
    fontFamily: FONTS.BOOK,
    fontSize: 20,
    fontWeight: "400",
    color: "#000000"
  },
  activenow: {
    color: 'darkgrey',
    fontWeight: '600'
  },
  row: {
    flexDirection: 'row'
  },
  flex: {
    flex: 1
  },
  btn: {
    height: 50,
    width: 50,
    borderRadius: 50, 
    alignItems:'center',
    justifyContent:'center',
    marginRight: 5
  },
  chatLayout:{
    height:60,
    marginHorizontal:20,
    backgroundColor:'#F5F5F5',
    borderRadius:30,
    alignItems: 'center'
  },
  typemessage:{
    marginLeft:15,
    fontSize:16,
    fontFamily:FONTS.BOOK,
    flex:1
  },
})