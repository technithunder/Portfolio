import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Container, Typography} from '../../components';
import {Images, Routes} from '../../constants';
import styles from './style';
import {navigate} from '../../utils';
import Icon from 'react-native-vector-icons/Ionicons'; // या आप जो भी icon library use करते हैं
import {changePassword} from '../../api';
import LinearButton from '../../components/LinearButton';
import {FONTS} from '../../constants/fonts';
import {COLORS} from '../../theme/colors';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const togglePasswordVisibility = field => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = 'Old password is required';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    }
    //  else if (formData.newPassword.length < 8) {
    //   newErrors.newPassword = 'Password must be at least 8 characters';
    // }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.oldPassword === formData.newPassword) {
      newErrors.newPassword =
        'New password must be different from old password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    const payload = {
      oldPassword: formData.oldPassword.trim(),
      newPassword: formData.newPassword.trim(),
    };
    if (validateForm()) {
      try {
        setLoading(true);
        const result = await changePassword(payload);
        console.log(result);
        if (result?.data?.status == 'success') {
          Alert.alert('Success', 'Password changed successfully!');

          setFormData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        }

        navigate(Routes.BottomStack, {screen: Routes.Profile});
      } catch (error) {
        console.log(error);
      }
    }
  };

  const renderPasswordInput = (field, placeholder, value) => {
    return (
      <View style={styles.inputContainer}>
        <View style={styles.passwordInputWrapper}>
          <TextInput
            style={[styles.input, errors[field] && styles.inputError]}
            placeholder={placeholder}
            placeholderTextColor="#999"
            value={value}
            onChangeText={text => handleInputChange(field, text)}
            secureTextEntry={!showPassword[field]}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => togglePasswordVisibility(field)}>
            <Icon
              name={showPassword[field] ? 'eye' : 'eye-off'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
      </View>
    );
  };

  return (
    <Container
      title="Change Password"
      leftIcon={Images.back}
      onLeftPress={() => navigate(Routes.BottomStack, {screen: Routes.Profile})}
      style={[styles.container]}>
      <View style={styles.formContainer}>
        {renderPasswordInput(
          'oldPassword',
          'Enter Old Password',
          formData.oldPassword,
        )}
        {renderPasswordInput(
          'newPassword',
          'Enter New Password',
          formData.newPassword,
        )}
        {renderPasswordInput(
          'confirmPassword',
          'Confirm New Password',
          formData.confirmPassword,
        )}

        {/* <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity> */}

        <LinearButton
          title="Change Password"
          onPress={handleChangePassword}
          style={styles.loginButton}
          gradientStyle={{height: 45}}
          textStyle={{
            fontSize: 16,
            fontFamily: FONTS.INTER_REGULAR,
            color: COLORS.APP_WHITE,
          }}
          loading={loading}
        />
      </View>
    </Container>
  );
};

export default ChangePassword;
