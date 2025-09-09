import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
//relative path imports
import styles from "./style";
import { COLORS } from '../../../config/colors';
//import icons
import Ionicons from 'react-native-vector-icons/Ionicons';
//relative path imports
import StyledButton from '../../../components/StyledButton';

const ResetPassword = ({ navigation }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const manageContinueBtn = () => {
        if (password === "") {
            Alert.alert("Alert", "Please enter a password")
            return;
        }

        if (password.length < 6) {
            Alert.alert("Alert", "Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Alert", "Passwords do not match.");
            return;
        }

        navigation.navigate("PhoneNumber");
    };

    return (
        <SafeAreaView style={styles.container}>
                          <StatusBar barStyle="dark-content" backgroundColor={COLORS.APP_WHITE} />
            
            <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} />
                </TouchableOpacity>
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.txtHeading}>Set your password</Text>
                    <Text style={styles.txtDescription}>Your Password must be 6 characters long</Text>
                    <View style={styles.textInput}>

                        <TextInput
                            placeholder='Enter Password'
                            placeholderTextColor={COLORS.APP_GRAY}
                            style={styles.input}
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity style={{marginLeft:10}} onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? "eye-off" : "eye"}
                                size={20}
                                color={COLORS.APP_GRAY}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.textInput}>
                        <TextInput
                            placeholder='Re-enter Password'
                            placeholderTextColor={COLORS.APP_GRAY}
                            style={styles.input}
                            secureTextEntry={!showConfirmPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity
                            style={{marginLeft:10}}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <Ionicons
                                name={showConfirmPassword ? "eye-off" : "eye"}
                                size={20}
                                color={COLORS.APP_GRAY}
                            />
                        </TouchableOpacity>
                    </View>

                    <StyledButton onPress={manageContinueBtn} title='Continue' style={{ marginTop: 20 }} />
                </View>
            </View>
        </SafeAreaView>
    );
}

export default ResetPassword;