import { moderateScale } from "react-native-size-matters"
import { COLORS } from "../../config/colors"
import { StyleSheet } from "react-native"

const styles  = StyleSheet.create({
    itemContainer:{
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.WHITE_SMOKE,
        padding:moderateScale(10),
        marginTop:moderateScale(20),
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    nextBtnView:{
        backgroundColor:COLORS.WHITE_SMOKE,
        borderRadius:40,
        height:moderateScale(30),
        width:moderateScale(30),
        alignItems:'center',
        justifyContent:'center',
    }
})

export default styles