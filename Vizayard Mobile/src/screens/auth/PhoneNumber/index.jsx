import React, { useRef, useState } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Alert, StatusBar } from 'react-native'
//relative path imports
import styles from "./style"
//import icons
import Ionicons from 'react-native-vector-icons/Ionicons';
//relative path imports
import StyledButton from '../../../components/StyledButton';
import PhoneInput from '../../../components/PhoneInput';
import { COLORS } from '../../../config/colors';

const PhoneNumber = ({ navigation }) => {

    const [selectedCountry, setSelectedCountry] = useState({
        "country": "India",
        "flag": "🇮🇳",
        "code": "+91",
        "phone_number_limit": 10
    });
    const [phoneInputValue, setPhoneInputValue] = useState("")

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
    };

    const onClickContinueBtn = () => {123456
        if (phoneInputValue === "") {
            Alert.alert("Alert", "Please enter a phone number")
            return;
        }

        if (phoneInputValue?.length == selectedCountry?.phone_number_limit) {
            navigation.navigate("Otp", { phoneNumber: phoneInputValue })
        } else {
            Alert.alert("Alert", "Phone number is not valid")
        }
    }

    return (
        <SafeAreaView style={styles.container}>
              <StatusBar barStyle="dark-content" backgroundColor={COLORS.APP_WHITE} />
            <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} />
                </TouchableOpacity>
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.txtHeading}>What’s your phone no. ?</Text>
                    <Text style={styles.txtDescription}>{`We need your phone number to provide \n status updates on your visa`}</Text>
                    <View style={{ marginTop: 30 }}>
                        <PhoneInput onSelectCountry={handleCountrySelect} onChangeText={(text) => setPhoneInputValue(text)} value={phoneInputValue} />

                    </View>
                    <StyledButton onPress={onClickContinueBtn} title='Continue' style={{ marginTop: 80 }} />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default PhoneNumber