import React, {useCallback, useState} from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import {TouchableOpacity, View, Alert, BackHandler} from 'react-native';
import {
  Button,
  Container,
  CustomConfirmModal,
  Icon,
  Typography,
} from '../../components';
import {COLORS} from '../../config/colors';
import {commonSty} from '../../theme';
import styles from './styles';
import {navigate, replace} from '../../utils';
import {Routes} from '../../config';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {
  createVisaApplication,
  paymentCreateApi,
  paymentVerifyApi,
} from '../../api';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {verticalScale} from 'react-native-size-matters';
import {IS_IOS} from '../../utils/helper';
import TermsConditionModal from '../../components/TermsConditionModal';
import HeaderWithBack from '../../components/HeaderWithBack';

const Checkout = ({navigation}) => {
  const route = useRoute();
  const data = route.params?.body || {};
  const finalAppID = useSelector(state => state?.main?.travelersAppID);

  const [refundSelected, setRefundSelected] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState({
    success: false,
    message: '',
  });

  const [orderInfo, setOrderInfo] = useState({
    amount: null,
    orderId: null,
    user: null,
  });

  const dynamicSelectedStyle = {
    backgroundColor: refundSelected ? COLORS.LIGHT_BLUE : COLORS.TRANSPARENT,
  };
  const dynamicUnSelectedTextStyle = {
    backgroundColor: refundSelected ? COLORS.TRANSPARENT : COLORS.LIGHT_BLUE,
  };

  const handleRefundSelect = () => !loading && setRefundSelected(true);
  const handleRefundUnSelect = () => !loading && setRefundSelected(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (loading) {
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, [loading]),
  );

  const handleProceedButtonPress = () => {
    if (acceptedTerms) {
      onPressCheckout();
    } else {
      setTermsModalVisible(true);
    }
  };

  const onCloseTermsModal = () => {
    setTermsModalVisible(false);
  };

  const onPressCheckout = async () => {
    if (!data?.visaId) {
      Alert.alert('Error', 'Missing visa information');
      return;
    }

    try {
      setLoading(true);

      let currentOrderInfo = {...orderInfo};

      if (!orderInfo.orderId || !orderInfo.amount || !orderInfo.user) {
        const payloadForOrder = {
          visaId: data.visaId,
          childUsers: data.childUsers || [],
          applicationId: finalAppID,
        };

        const response = await paymentCreateApi(payloadForOrder);

        if (!response?.data?.status) {
          throw new Error(
            response?.data?.message || 'Failed to create payment order',
          );
        }

        const {orderId, amount, user} = response.data.data;
        currentOrderInfo = {orderId, amount, user};
        setOrderInfo(currentOrderInfo);
      }

      const {orderId, amount, user} = currentOrderInfo;

      const options = {
        name: 'VIZAYARD',
        currency: 'INR',
        key: process.env.PAYMENT_KEY_ID,
        amount,
        order_id: orderId,
        prefill: {
          email: user?.email || '',
          contact: user?.phoneNumber || '',
        },
        theme: {
          color: COLORS.APP_PRIMARY_MAIN,
        },
        retry: {enabled: true, max_count: 3},
        remember_customer: true,
        send_sms_hash: true,
      };

      const paymentData = await RazorpayCheckout.open(options);

      const verifyPayload = {
        orderId: paymentData.razorpay_order_id,
        paymentId: paymentData.razorpay_payment_id,
        signatureId: paymentData.razorpay_signature,
      };

      const verifyRes = await paymentVerifyApi(verifyPayload);
      if (!verifyRes?.data?.status) {
        throw new Error(
          verifyRes?.data?.message || 'Payment verification failed',
        );
      }

      const visaPayload = {
        parentUserId: data.parentUserId,
        appId: finalAppID,
        visaId: data.visaId,
        childUsers: data.childUsers || [],
      };

      const visaResponse = await createVisaApplication(visaPayload);

      if (!visaResponse?.data?.status) {
        setPaymentStatus({
          success: true,
          message: 'Payment successful',
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Payment successful. Your visa application has been created.',
          topOffset: verticalScale(IS_IOS ? 60 : 40),
        });
        navigate('History');
        // replace(Routes.Bottom, {
        //   screen: Routes.Application,
        // });
      }
    } catch (error) {
      console.error('Payment Error:', error);
      if (error.code === 'PAYMENT_CANCELLED') {
        Alert.alert('Payment Cancelled', 'You cancelled the payment process.');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2:
            error.message ||
            'There was an issue processing your payment. Please try again.',
          topOffset: verticalScale(IS_IOS ? 60 : 40),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = () => {
    setPaymentModal(false);
    if (paymentStatus.success) {
      replace(Routes.Bottom, {
        screen: Routes.Application,
      });
    }
  };

  return (
    <Container
      showHeader={false}
      contentContainerStyle={{flex: 1, backgroundColor: COLORS.APP_WHITE}}>
      <HeaderWithBack
        title={'Travel Insurance'}
        onBack={() => !loading && navigation.goBack()}
      />
      <View style={styles.mainContainer}>
        <View style={styles.subContainer}>
          <View style={[commonSty.rowStart, commonSty.mt20]}>
            <Icon
              icon="Entypo"
              name="shield"
              color={COLORS.APP_PRIMARY_MAIN}
              size={28}
            />
            <Typography
              title="Get free cancellation & visa modification with Assured Flex"
              size={16}
              ml={10}
            />
          </View>
          <Typography
            title="@only ₹74/person"
            color={COLORS.APP_COMMON_GRAY}
            size={14}
            mt={8}
            ml={40}
          />
        </View>

        <View style={styles.mainRefundContainer}>
          <TouchableOpacity
            style={[styles.radioTextContainer, dynamicSelectedStyle,{borderTopLeftRadius:10,borderTopRightRadius:10}]}
            activeOpacity={0.8}
            onPress={handleRefundSelect}
            disabled={loading}>
            <Icon
              icon="MaterialCommunityIcons"
              name={refundSelected ? 'radiobox-marked' : 'radiobox-blank'}
              color={refundSelected ? COLORS.APP_WHITE : COLORS.APP_PRIMARY_MAIN}
              size={18}
            />
            <View>
              <Typography
                title="Yes I want a visa refund"
                size={14}
                ml={8}
                numberOfLines={1}
                color={refundSelected ? COLORS.APP_WHITE : COLORS.APP_BLACK}
              />
              <View style={styles.radioSubContainer}>
                <Icon
                  icon="Ionicons"
                  name="shield-checkmark"
                  color={refundSelected ? COLORS.APP_WHITE : COLORS.APP_PRIMARY_MAIN}
                  size={12}
                />
                <Typography
                  title="Refund: ₹720"
                  color={refundSelected ? COLORS.APP_WHITE : COLORS.APP_PRIMARY_MAIN}
                  size={12}
                  ml={5}
                />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.border} />

          <TouchableOpacity
            style={[styles.radioTextContainer, dynamicUnSelectedTextStyle,{borderBottomLeftRadius:10,borderBottomRightRadius:10}]}
            activeOpacity={0.8}
            onPress={handleRefundUnSelect}
            disabled={loading}>
            <Icon
              icon="MaterialCommunityIcons"
              name={!refundSelected ? 'radiobox-marked' : 'radiobox-blank'}
              color={!refundSelected ? COLORS.APP_WHITE : COLORS.APP_PRIMARY_MAIN}
              size={18}
            />
            <Typography
              title="No, I don't want a full visa refund"
              size={13}
              ml={8}
              numberOfLines={1}
               color={!refundSelected ? COLORS.APP_WHITE : COLORS.APP_PRIMARY_MAIN}
            />
          </TouchableOpacity>
        </View>
      </View>

      <CustomConfirmModal
        open={paymentModal}
        message={paymentStatus.message}
        submitLabel="Okay"
        handleConfirm={handleConfirmPayment}
      />

      <TermsConditionModal
        visible={termsModalVisible}
        onAccept={onPressCheckout}
        onClose={onCloseTermsModal}
        setAcceptedTerms={setAcceptedTerms}
        acceptedTerms={acceptedTerms}
      />

      <Button
        title="Proceed to Payment"
        loading={loading}
        onPress={handleProceedButtonPress}
        disabled={loading}
      />
    </Container>
  );
};

export default Checkout;
