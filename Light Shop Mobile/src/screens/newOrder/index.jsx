import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import styles from './style';
import {Icon, Typography} from '../../components';
import {FONTS} from '../../constants/fonts';
import {Images, orderStatusData, Routes} from '../../constants';
import {COLORS} from '../../theme/colors';
import {getAllOrders} from '../../api';
import {orderStatus} from '../../constants/data';
import debounce from 'lodash.debounce';
import moment from 'moment';

const Order = ({navigation}) => {
  const [selectedTab, setSelectedTab] = useState(orderStatusData[0]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchOrders(1, searchText, true);
  }, [selectedTab]);

  const fetchOrders = async (pageNum = 1, search = '', isInitial = false) => {
    try {
      if (isInitial) {
        if (pageNum === 1) {
          setIsInitialLoading(true);
        }
        setRefreshing(true);
        setHasMore(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await getAllOrders(selectedTab.key, pageNum, search);
      if (response?.data?.status === 'success') {
        const fetchedOrders = response.data.data.orders;
        const pagination = response.data.data.pagination || {};
        const total = pagination.totalOrders || 0;
        const totalPages = pagination.totalPages || 0;
        const hasMoreData = pageNum < totalPages;
        setHasMore(hasMoreData);
        setTotalCount(total);

        if (pageNum === 1) {
          setData(fetchedOrders);
        } else {
          setData(prev => [...prev, ...fetchedOrders]);
        }

        setPage(pageNum);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setRefreshing(false);
      setIsLoadingMore(false);
      setIsInitialLoading(false);
    }
  };

  const handleTabChange = newTab => {
    setSelectedTab(newTab);
    setPage(1);
    setSearchText('');
  };

  const handleSearchChange = text => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const debouncedSearch = useCallback(
    debounce(text => {
      fetchOrders(1, text, true);
    }, 500),
    [],
  );

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchOrders(page + 1, searchText);
    }
  };

  const onRefresh = () => {
    fetchOrders(1, searchText, true);
  };

  const OrderSkeleton = () => (
    <SkeletonPlaceholder
      backgroundColor={COLORS.APP_LIGHT_GRAY || '#F5F5F5'}
      highlightColor={COLORS.APP_WHITE || '#FFFFFF'}
      speed={1200}>
      <View
        style={[
          {
            marginBottom: 16,
            backgroundColor: COLORS.APP_WHITE,
            borderRadius: 10,
            padding: 16,
            marginVertical: 8,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 0.3,
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{width: 120, height: 20, borderRadius: 4}} />
          <View style={{width: 80, height: 16, borderRadius: 4}} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
          }}>
          <View style={{width: 80, height: 16, borderRadius: 4}} />
          <View style={{width: 100, height: 16, borderRadius: 4}} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
          }}>
          <View style={{width: 80, height: 16, borderRadius: 4}} />
          <View style={{width: 60, height: 32, borderRadius: 6}} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );

  const TabsSkeleton = () => (
    <SkeletonPlaceholder
      backgroundColor={COLORS.APP_LIGHT_GRAY || '#F5F5F5'}
      highlightColor={COLORS.APP_WHITE || '#FFFFFF'}
      speed={1200}>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          marginTop: 16,
          marginBottom: 10,
        }}>
        {[1, 2, 3, 4].map(index => (
          <View key={index} style={{width: 80, height: 36, borderRadius: 18}} />
        ))}
      </View>
    </SkeletonPlaceholder>
  );

  console.log(data, 'data');

  const renderOrderItem = ({item}) => (
    <View style={styles.orderCard}>
      <Typography
        title={`Order #${item.orderNumber}`}
        size={18}
        font={FONTS.INTER_SEMIBOLD}
      />
      {item?.createdAt && (
        <Typography
          title={moment(item.createdAt).format('DD/MM/YYYY')}
          align="right"
          font={FONTS.INTER_REGULAR}
          size={14}
          color={COLORS.APP_LABEL}
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <Text style={styles.labelText}>
          Quantity:{' '}
          <Text style={[styles.valueText, {color: COLORS.APP_BLACK}]}>
            {item?.totalItems}
          </Text>
        </Text>
        <Text style={styles.labelText}>
          Subtotal:{' '}
          <Text
            style={[
              styles.valueText,
              {fontFamily: FONTS.INTER_SEMIBOLD, color: COLORS.APP_BLACK},
            ]}>
            ₹{item?.totalAmount?.toFixed()}
          </Text>
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 16,
        }}>
        <Typography
          title={orderStatus[item.status]}
          size={14}
          color="#CF6212"
          font={FONTS.INTER_REGULAR}
        />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(Routes.OrderDetails, {orderId: item.id})
          }
          style={styles.detailsButton}>
          <Typography title={'Details'} size={14} font={FONTS.INTER_REGULAR} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSkeletonList = () => (
    <View>
      {[1, 2, 3, 4, 5].map(index => (
        <OrderSkeleton key={index} />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Typography title={'Orders'} size={18} font={FONTS.INTER_MEDIUM} />
      </View>

      <View style={styles.searchBarContainer}>
        <Icon
          icon="AntDesign"
          name="search1"
          size={16}
          color={COLORS.APP_GRAY}
        />
        <TextInput
          placeholder="Search"
          value={searchText}
          onChangeText={handleSearchChange}
          placeholderTextColor={COLORS.APP_GRAY}
          style={styles.searchInput}
        />
      </View>

      {isInitialLoading ? (
        <TabsSkeleton />
      ) : (
        <View style={{marginTop: 16, marginBottom: 10}}>
          <FlatList
            data={orderStatusData}
            horizontal
            keyExtractor={item => item.key}
            contentContainerStyle={{gap: 10}}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => handleTabChange(item)}
                style={[
                  styles.tabItem,
                  item.key === selectedTab.key && styles.activeTabItem,
                ]}>
                <Typography
                  title={item.title}
                  size={14}
                  color={
                    item.key === selectedTab.key
                      ? COLORS.APP_WHITE
                      : COLORS.APP_BLACK
                  }
                />
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {totalCount > 0 && (
        <View style={{paddingHorizontal: 16, marginBottom: 5}}>
          <Typography
            title={`${totalCount} order${totalCount !== 1 ? 's' : ''} found`}
            size={12}
            color={COLORS.APP_GRAY}
            font={FONTS.INTER_REGULAR}
          />
        </View>
      )}

      {isInitialLoading ? (
        renderSkeletonList()
      ) : data.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Typography
            title={
              searchText ? 'No orders found for your search' : 'No orders found'
            }
            size={16}
            color={COLORS.APP_GRAY}
            font={FONTS.INTER_REGULAR}
          />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderOrderItem}
          keyExtractor={(item, index) => `${item.orderNumber}-${index}`}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={
            isLoadingMore ? <ActivityIndicator size={18} /> : null
          }
          contentContainerStyle={{paddingBottom: 90}}
        />
      )}
    </SafeAreaView>
  );
};

export default Order;
