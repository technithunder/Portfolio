import {View} from 'react-native';
import React from 'react';
import {Button, Container, TextField, Typography} from '../../components';
import {useFormik} from 'formik';
import {loginSchema, loginValues, navigate} from '../../utils';
import {Fonts, Images, Routes} from '../../constants';
import {colors, commonSty} from '../../theme';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import {setCredential} from '../../redux';

const Login = () => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: loginValues,
    validationSchema: loginSchema,
    onSubmit: values => {
      dispatch(setCredential(values));
    },
  });
  const {handleSubmit} = formik;
  const handleForgotPress = () => navigate(Routes.ForgotPassword);
  return (
    <Container isAvoidKeyboard showHeader={false}>
      <Typography title={'Log into\nyour account'} mt={100} ml={30} size={30} />
      <View style={commonSty.mv20}>
        <TextField
          formik={formik}
          name={'email'}
          placeholder="Email address"
          leftIcon={Images.email}
          keyboardType="email-address"
        />
        <TextField
          formik={formik}
          name={'password'}
          placeholder="Password"
          isPassword
          leftIcon={Images.password}
        />
        <Typography
          title={'Forgot Password ? '}
          size={14}
          align="right"
          mr={35}
          mt={10}
          font={Fonts.Light}
          onPress={handleForgotPress}
        />
      </View>
      <Button
        title="LOG IN"
        width={moderateScale(140)}
        borderRadius={50}
        backgroundColor={colors.oil}
        btnStyle={[commonSty.mv30, commonSty.mb55]}
        onPress={() => handleSubmit()}
      />
    </Container>
  );
};

export default Login;
