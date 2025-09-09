import React, {useEffect, useState} from 'react';
import {Button, Container} from '../../components';
import {useRoute} from '@react-navigation/native';
import {OrderDetailCard, ProductDetailCard, StatusCard} from './components';
import {colors} from '../../theme';
import {ActivityIndicator, View} from 'react-native';
import styles from './styles';
import {Routes} from '../../constants';
import {replace} from '../../utils';
import {getSingleOrder} from '../../api';
import { COLORS } from '../../theme/colors';

const OrderDetails = () => {
  const route = useRoute<any>().params;
  const orderId = route?.orderId;
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchSingleOrder();
  }, [orderId]);

  const fetchSingleOrder = async () => {
    setLoading(true);
    try {
      const response = await getSingleOrder(orderId);
      if (response?.data?.status === 'success') {
        setLoading(false);
        setData(response?.data?.data?.order);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleHomePress = () => replace(Routes.BottomStack);

  console.log(data, 'order details data');

  if (isLoading || !data) {
    return (
      <Container showBack title="Order">
        <View style={styles.subContainer}>
           <ActivityIndicator size={40} color={COLORS.APP_PRIMARY} />
        </View>
      </Container>
    );
  }

  return (
    <Container isScroll showBack title={`Order # ${data?.orderNumber}`}>
      {/* <View style={styles.subContainer}> */}
        {/* <StatusCard order={data} /> */}
        <OrderDetailCard order={data} />
        <ProductDetailCard order={data} />
        <View style={[styles.buttonContainer,{marginVertical:50}]}>
          <Button
            title="Return Home"
            borderRadius={30}
            width={250}
            backgroundColor={colors.transparent}
            borderColor={colors.gravel}
            txtClr={colors.slateGrey}
            onPress={handleHomePress}
          />
        </View>
      {/* </View> */}
    </Container>
  );
};

export default OrderDetails;