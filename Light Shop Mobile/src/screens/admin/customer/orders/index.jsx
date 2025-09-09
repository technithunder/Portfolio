import React, {useEffect, useState, useCallback} from 'react';
import {useRoute} from '@react-navigation/native';
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
import styles from './style';
import debounce from 'lodash.debounce';
import moment from 'moment';
import {colors, COLORS} from '../../../../theme/colors';
import {FONTS} from '../../../../constants/fonts';
import {orderStatus, orderStatusData} from '../../../../constants/data';
import {Images, Routes} from '../../../../constants';
import {Icon, Typography} from '../../../../components';
import {getAllDealerOrders} from '../../../../api';

const Order = ({navigation}) => {
  const route = useRoute();
  const customerId = route?.params?.customerId;

  // Find "All" tab or default to first tab
  const allTab = orderStatusData.find(
    tab => tab.key === 'all' || tab.key === 'All',
  );
  const defaultTab = allTab || orderStatusData[0];

  const [selectedTab, setSelectedTab] = useState(defaultTab);
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
      if (isLoadingMore && !isInitial) return;

      if (isInitial) {
        if (pageNum === 1) {
          setRefreshing(true);
        }
        setIsInitialLoading(pageNum === 1);
        setHasMore(true);
      } else {
        setIsLoadingMore(true);
      }

      const statusToPass =
        selectedTab.key === 'all' || selectedTab.key === 'All'
          ? null
          : selectedTab.key;

      const response = await getAllDealerOrders(
        customerId,
        statusToPass,
        pageNum,
        search,
      );

      if (response?.data?.status === 'success') {
        const fetchedOrders = response.data.data.orders || [];
        const pagination = response.data.data.pagination;
        const totalPages = pagination?.totalPages || 1;
        const currentPage = pagination?.currentPage || pageNum;
        const total = pagination.totalOrders || 0;
        setTotalCount(total);

        setHasMore(currentPage < totalPages);

        if (pageNum === 1) {
          setData(fetchedOrders);
        } else {
          setData(prev => {
            // Prevent duplicate entries
            const existingIds = new Set(prev.map(item => item.id));
            const newOrders = fetchedOrders.filter(
              order => !existingIds.has(order.id),
            );
            return [...prev, ...newOrders];
          });
        }

        setPage(pageNum);
      } else {
        // Handle API error response
        if (pageNum === 1) {
          setData([]);
        }
        setHasMore(false);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
      if (pageNum === 1) {
        setData([]);
      }
      setHasMore(false);
    } finally {
      setRefreshing(false);
      setIsLoadingMore(false);
      setIsInitialLoading(false);
    }
  };

  const handleTabChange = newTab => {
    if (newTab.key === selectedTab.key) return;

    setSelectedTab(newTab);
    setPage(1);
    setSearchText('');
    setData([]);
    setHasMore(true);
  };

  const handleSearchChange = text => {
    setSearchText(text);
    setPage(1);
    setData([]);
    setHasMore(true);
    debouncedSearch(text);
  };

  const debouncedSearch = useCallback(
    debounce(text => {
      fetchOrders(1, text, true);
    }, 500),
    [selectedTab],
  );

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore && data.length > 0) {
      fetchOrders(page + 1, searchText, false);
    }
  };

  const onRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchOrders(1, searchText, true);
  };

  console.log(
    'Current page:',
    page,
    'Has more:',
    hasMore,
    'Total items:',
    data.length,
    'Selected tab:',
    selectedTab.key,
  );

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
            navigation.navigate(Routes.AdminCustomerOrderDetail, {
              orderId: item.id,
              customerId: customerId,
            })
          }
          style={styles.detailsButton}>
          <Typography title={'Details'} size={14} font={FONTS.INTER_REGULAR} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => {
    if (isInitialLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={COLORS.APP_PRIMARY} />
          <Typography
            title="Loading orders..."
            size={16}
            color={COLORS.APP_GRAY}
            font={FONTS.INTER_REGULAR}
            style={{marginTop: 10}}
          />
        </View>
      );
    }

    return (
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
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={{padding: 20, alignItems: 'center'}}>
        <ActivityIndicator size="small" color={COLORS.APP_PRIMARY} />
        <Typography
          title="Loading more..."
          size={14}
          color={COLORS.APP_GRAY}
          style={{marginTop: 5}}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerContainer}>
        
        <View style={[styles.smallContainer]}>
          <Icon
            icon="Ionicons"
            name="chevron-back-outline"
            containerStyle={styles.leftIconSubContainer}
            onPress={() =>
              navigation.navigate(Routes.AdminCustomerProfile, {
                customerId: customerId,
              })
            }
            size={20}
            color={colors.primary}
          />
        </View>
        <Typography title={'Orders'} size={18} font={FONTS.INTER_MEDIUM} />
        <View />
      </View>

      {/* Search */}
      <View style={styles.searchBarContainer}>
        <Icon
          icon="AntDesign"
          name="search1"
          size={16}
          color={COLORS.APP_GRAY}
        />
        <TextInput
          placeholder="Search orders.."
          value={searchText}
          onChangeText={handleSearchChange}
          placeholderTextColor={COLORS.APP_GRAY}
          style={styles.searchInput}
        />
      </View>

      {/* Tabs */}
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

      {/* Orders List */}
      {data.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={data}
          renderItem={renderOrderItem}
          keyExtractor={(item, index) =>
            `${item.id || item.orderNumber}-${index}`
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{paddingBottom: 90}}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      )}
    </SafeAreaView>
  );
};

export default Order;
