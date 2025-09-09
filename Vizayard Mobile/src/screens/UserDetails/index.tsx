import React, {useEffect, useState, useCallback} from 'react';
import {
  Keyboard,
  ScrollView,
  View,
  RefreshControl,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {Button, Container, TextField} from '../../components';
import {useFormik} from 'formik';
import styles from './styles';
import {replace, userDetailSchema} from '../../utils';
import {userDetailProps} from '../../utils/types';
import {Routes} from '../../config';
import {commonSty} from '../../theme';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {
  bookAvailableSlots,
  editScheduleCall,
  scheduledCallCreatePaymentApi,
  scheduledCallPaymentVerify,
} from '../../api';
import Toast from 'react-native-toast-message';
import {COLORS} from '../../config/colors';
import RazorpayCheckout from 'react-native-razorpay';

const UserDetails = ({navigation}) => {
  const route = useRoute();
  const {params} = route;
  const {date, time, id, userEmail, userName, userPhone, description} = params;

  const [isLoading, setIsLoading] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // const [scheduleCallId, setScheduleCallId] = useState<string | null>(null);
  // const [amount, setAmount] = useState<number | null>(null);
  // const [orderId, setOrderId] = useState<string | null>(null);

  const [orderInfo, setOrderInfo] = useState({
    amount: null,
    orderId: null,
    scheduleCallId: null,
  });

  const formik = useFormik({
    initialValues: {
      userName: userName || '',
      userEmail: userEmail || '',
      userPhone: userPhone || '',
      description: description || '',
    },
    validationSchema: userDetailSchema,
    onSubmit: values => handleSubmit(values),
  });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isLoading) {
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, [isLoading]),
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardOpen(true),
    );
    return () => keyboardDidShowListener.remove();
  }, []);

  const handleSubmit = async (values: userDetailProps) => {
    setIsLoading(true);

    const data = {
      userName: values.userName,
      userPhone: values.userPhone,
      description: values.description,
      userEmail: values.userEmail,
      date,
      timeSlot: time,
    };

    try {
      if (id) {
        const editResponse = await editScheduleCall(id, data);
        const editData = editResponse?.data;

        if (editData?.status) {
          Toast.show({
            type: 'success',
            text1: editData.message || 'Call rescheduled successfully',
          });
          replace(Routes.Bottom, {screen: Routes.Consult});
          return;
        } else {
          return;
        }
      }

      let updatedOrderInfo = {...orderInfo};

      if (
        !updatedOrderInfo.scheduleCallId ||
        !updatedOrderInfo.amount ||
        !updatedOrderInfo.orderId
      ) {
        const scheduleResponse = await bookAvailableSlots(data);
        const scheduleData = scheduleResponse?.data;

        if (!scheduleData?.data?.id || !scheduleData?.data?.amount) {
          return;
        }

        const newScheduleCallId = scheduleData?.data?.id;
        const newAmount = scheduleData?.data?.amount;

        const paymentInitPayload = {
          amount: newAmount,
          scheduleCallId: newScheduleCallId,
        };

        const paymentResponse = await scheduledCallCreatePaymentApi(
          paymentInitPayload,
        );
        const paymentData = paymentResponse?.data;
        console.log('Payment Initialization', paymentData);
        if (!paymentData?.status || !paymentData?.data?.orderId) {
          return;
        }

        updatedOrderInfo = {
          scheduleCallId: newScheduleCallId,
          amount: newAmount,
          orderId: paymentData?.data?.orderId,
        };

        setOrderInfo(updatedOrderInfo);
      }

      const {orderId, amount} = updatedOrderInfo;

      const options = {
        name: 'VIZAYARD',
        currency: 'INR',
        key: process.env.PAYMENT_KEY_ID,
        amount,
        order_id: orderId,
        theme: {color: COLORS.APP_PRIMARY_MAIN},
        retry: {enabled: true, max_count: 3},
        remember_customer: true,
        send_sms_hash: true,
      };

      let razorpayResult;
      try {
        razorpayResult = await RazorpayCheckout.open(options);
        console.log('Payment Success:', razorpayResult);
      } catch (err) {
        console.log('Payment Cancelled/Error:', err);
        Toast.show({
          type: 'error',
          text1: 'Payment process failed',
        });
        return;
      }

      const verifyPayload = {
        orderId: razorpayResult.razorpay_order_id,
        paymentId: razorpayResult.razorpay_payment_id,
        signatureId: razorpayResult.razorpay_signature,
      };

      const verifyResponse = await scheduledCallPaymentVerify(verifyPayload);
      console.log('Payment Verification Response:', verifyResponse);
      const verifyData = verifyResponse?.data;
      console.log('Payment Verification:', verifyData);
      if (!verifyData?.status) {
        return;
        // throw new Error(verifyData?.message || 'Payment verification failed');
      }

      Toast.show({
        type: 'success',
        text1: verifyData.message || 'Payment successful',
      });

      replace(Routes.Bottom, {screen: Routes.Consult});
    } catch (error: any) {
      console.error('Error:', error);
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const dynamicSubContainerStyles = {
    flexGrow: keyboardOpen ? 0.9 : 0.6,
  };

  const isFormFilled =
    formik.values.userName.trim() &&
    formik.values.userEmail.trim() &&
    formik.values.userPhone.trim() &&
    formik.values.description.trim();

  return (
    <Container
      title="Details"
      showBack
      isAvoidKeyboard
      onLeftPress={() => !isLoading && navigation.goBack()}
      containerStyle={commonSty.flex}>
      <ScrollView
        contentContainerStyle={dynamicSubContainerStyles}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.subContainer}>
          <TextField
            formik={formik}
            name={'userName'}
            title="Name"
            placeholder="Enter your name"
          />
          <TextField
            formik={formik}
            name={'userEmail'}
            title="Email"
            placeholder="Enter your email"
          />
          <TextField
            formik={formik}
            name={'userPhone'}
            title="Phone no."
            placeholder="Enter your number"
            keyboardType="phone-pad"
          />
          <TextField
            formik={formik}
            name={'description'}
            title="Description"
            placeholder="Enter description here..."
            multiline
            inputContainerStyle={styles.desContainer}
            textInputStyle={styles.textInputStyle}
            textAlignVertical="top"
          />
        </View>

        <Button
          title="Book a call"
          loading={isLoading}
          onPress={() => formik.handleSubmit()}
          btnStyle={[commonSty.mb30, commonSty.mt30]}
          disabled={!isFormFilled}
        />
      </ScrollView>
    </Container>
  );
};

export default UserDetails;
