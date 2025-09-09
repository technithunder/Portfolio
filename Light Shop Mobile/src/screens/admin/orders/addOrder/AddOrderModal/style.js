import { StyleSheet } from "react-native";
import { FONTS } from "../../../../../constants/fonts";
import { COLORS } from "../../../../../theme/colors";

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
      },
      container: {
        width: '95%',
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
      },
      closeButton: {
        padding: 5,
      },
      closeText: {
        fontSize: 18,
        color: '#666',
        fontWeight: 'bold',
      },
      content: {
        padding: 10,
        minHeight: 200,
      },
      placeholder: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 50,
      },
      footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
      },
      cancelButton: {
        flex: 1,
        padding: 12,
        marginRight: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        alignItems: 'center',
      },
      cancelText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
      },
      submitButton: {
        flex: 1,
        padding: 12,
        marginLeft: 10,
        backgroundColor: COLORS.APP_PRIMARY,
        borderRadius: 8,
        alignItems: 'center',
      },
      submitText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
      },
      inputField: {
        borderWidth: 1,
        borderColor: COLORS.APP_GRAY,
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 14,
        color: COLORS.APP_BLACK,
        marginTop: 5,
        fontFamily: FONTS.INTER_REGULAR,
      },
      dropdownPlaceholder: {
        color: COLORS.APP_GRAY,
        fontSize: 16,
        fontFamily: FONTS.INTER_REGULAR,
      },
      dropdownSelectedText: {
        color: COLORS.APP_BLACK,
        fontSize: 16,
        fontFamily: FONTS.INTER_REGULAR,
      },
      dropdownSearch: {
        color: COLORS.APP_BLACK,
        fontSize: 16,
        fontFamily: FONTS.INTER_REGULAR,
      },
      dropdownIcon: {
        width: 20,
        height: 20,
      },
    
      dropdown: {
        height: 50,
      },
})

export default styles;