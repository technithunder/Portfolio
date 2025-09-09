import {
  FlatList,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Container} from '../../components';
import {Images, ordersData, orderStatusData, Routes} from '../../constants';
import {OrderCard, TabBar} from './components';
import {commonSty} from '../../theme';
import {navigate} from '../../utils';
import {getAllOrders} from '../../api';
import {COLORS} from '../../theme/colors';

const Orders = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState(orderStatusData[0]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Fetch orders when selected tab changes
  useEffect(() => {
    if (selectedTab) {
      fetchAllOrders(selectedTab.key);
    }
  }, [selectedTab]);

  const fetchAllOrders = async (status = null) => {
    setIsLoading(true);
    try {
      // Pass the status parameter to the API call
      const response = await getAllOrders(status || selectedTab?.key);
      if (response?.data?.status === 'success') {
        setOrderData(response?.data?.data);
        // Filter orders based on selected tab if needed
        const filteredOrders =
          response?.data?.data?.orders?.filter(
            order => !status || order.status === status,
          ) || [];
        setData(filteredOrders);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotifyPress = () => navigation.jumpTo(Routes.Notify);

  const handleTabChange = newTab => {
    setSelectedTab(newTab);
    // Data will be fetched in useEffect when selectedTab changes
  };

  const renderItem = ({item}) => {
    return <OrderCard item={item} onPress={() => handleOrderDetails(item)} />;
  };

  const handleOrderDetails = item => {
    navigate(Routes.OrderDetails, {orderId: item?.id});
  };

  console.log('Selected Tab:', selectedTab);
  console.log('Filtered Data:', data);

  return (
    <Container
      title="My Orders"
      rightIcon={Images.bell}
      leftIcon={Images.drawer}
      onRightPress={handleNotifyPress}>
      <View
        style={{
          flex: 0.1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TabBar
          data={orderStatusData}
          selectedTab={selectedTab}
          setSelectedTab={handleTabChange}
        />
      </View>

      {isLoading ? (
        <View style={[commonSty.flex, commonSty.center]}>
          <ActivityIndicator size="large" color={COLORS.APP_PRIMARY} />
        </View>
      ) : data.length === 0 ? (
        <View style={[commonSty.flex, commonSty.center]}>
          <Text style={{fontSize: 16, color: 'gray'}}>
            No orders found for this status.
          </Text>
        </View>
      ) : (
        <View style={commonSty.flex}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            nestedScrollEnabled
            contentContainerStyle={commonSty.pb100}
            showsVerticalScrollIndicator={false}
            refreshing={isLoading}
            onRefresh={() => fetchAllOrders(selectedTab?.key)}
          />
        </View>
      )}
    </Container>
  );
};

export default Orders;
