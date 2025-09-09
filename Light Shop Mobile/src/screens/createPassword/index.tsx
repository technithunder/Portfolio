import React, {useRef} from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import {moderateScale} from 'react-native-size-matters';
import {ActionSheetRef} from 'react-native-actions-sheet';
import {RouteProp, useRoute} from '@react-navigation/native';

import {Button, Container, Icon, TextField, Typography} from '../../components';
import {Fonts, Images} from '../../constants';
import {colors, commonSty} from '../../theme';
import {changePasswordValues, goBack, changePasswordSchema} from '../../utils';
import {ChangedSheet} from './components';
import {ParamsProps} from './types';
import {setCredential} from '../../redux';

const CreatePassword = () => {
  const dispatch = useDispatch();
  const passCreatedSheet = useRef<ActionSheetRef>(null);
  const route = useRoute<RouteProp<ParamsProps, 'CreatePassword'>>();

  const formik = useFormik({
    initialValues: changePasswordValues,
    validationSchema: changePasswordSchema,
    onSubmit: values => passCreatedSheet.current?.show(),
  });
  const {handleSubmit} = formik;
  const handleAuthenticate = () => {
    let data = {
      email: route?.params?.email || '',
      password: formik?.values?.password,
    };
    passCreatedSheet.current?.hide();
    dispatch(setCredential(data));
  };
  return (
    <Container isAvoidKeyboard>
      <View>
        <Icon
          icon="Ionicons"
          name="chevron-back-outline"
          containerStyle={commonSty.backContainer}
          onPress={goBack}
          size={20}
          color={colors.primary}
        />
        <Typography
          title={'Create new password'}
          align="left"
          mt={30}
          size={24}
          ml={25}
        />
        <Typography
          title={
            'Your new password must be different from previously used password'
          }
          font={Fonts.Light}
          mh={25}
          mt={15}
          size={16}
        />
        <TextField
          formik={formik}
          name={'password'}
          placeholder="New password"
          isPassword
          leftIcon={Images.password}
        />
        <TextField
          formik={formik}
          name={'confirmPassword'}
          placeholder="Confirm password"
          isPassword
          leftIcon={Images.password}
        />
        <Button
          title="CONFIRM"
          width={moderateScale(140)}
          borderRadius={50}
          backgroundColor={colors.oil}
          btnStyle={commonSty.mv40}
          onPress={() => handleSubmit()}
        />
        <ChangedSheet ref={passCreatedSheet} onHomePress={handleAuthenticate} />
      </View>
    </Container>
  );
};

export default CreatePassword;
