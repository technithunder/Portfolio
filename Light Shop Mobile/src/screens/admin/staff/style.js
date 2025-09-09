import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../constants/fonts";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: COLORS.APP_WHITE,
    },
    inputView:{
        backgroundColor:COLORS.APP_LIGHT_GRAY,
        height:40,
        marginHorizontal:20,
        borderRadius:50,
        marginTop:20,
        flexDirection:'row',
        alignItems:'center',    
        paddingHorizontal:16,
    },
    searchInput:{
        color:COLORS.APP_BLACK,
        fontFamily:FONTS.INTER_REGULAR,
        fontSize:14,
    },
    addButton:{
        position:'absolute',
        bottom:60,
        right:30,
        width:46,
        height:46,
        backgroundColor:COLORS.APP_PRIMARY,
        borderRadius:50,
        justifyContent:'center',
        alignItems:'center',
        zIndex:999
    }
})

export default styles