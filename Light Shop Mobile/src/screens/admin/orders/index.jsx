import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {useSelector} from 'react-redux';
import moment from 'moment';
import debounce from 'lodash.debounce';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './style';
import {FONTS} from '../../../constants/fonts';
import {colors, COLORS} from '../../../theme/colors';
import {Icon, Typography} from '../../../components';
import {orderStatus, orderStatusData} from '../../../constants/data';
import {Images, Routes} from '../../../constants';
import {getAllOrdersAdmin} from '../../../api';
import {useRoute} from '@react-navigation/native';
import {navigate} from '../../../utils';

const filterOptions = [
  {key: 'all', title: 'All'},
  {key: 'assignedToMe', title: 'Assigned to Me'},
];

const Order = ({navigation}) => {
  const route = useRoute();
  const statusFromParams = route.params?.status;
  const user = useSelector(state => state.auth.user);

  // Find the tab based on status parameter or default to 'All' tab
  const getInitialTab = () => {
    if (statusFromParams) {
      const foundTab = orderStatusData.find(
        tab => tab.key === statusFromParams,
      );
      return foundTab || orderStatusData[0]; // Default to 'All' if not found
    }
    return orderStatusData[0]; // Default to 'All' tab
  };

  const [selectedTab, setSelectedTab] = useState(getInitialTab());
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isTabChanging, setIsTabChanging] = useState(false);
  const [isFilterChanging, setIsFilterChanging] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' or 'assignedToMe'

  const loadingRef = useRef(false);
  const searchTimeoutRef = useRef(null);

  console.log("==>data",data)

  // Handle status parameter change
  useEffect(() => {
    if (statusFromParams) {
      const foundTab = orderStatusData.find(
        tab => tab.key === statusFromParams,
      );
      if (foundTab && foundTab.key !== selectedTab.key) {
        console.log(
          'Status from params:',
          statusFromParams,
          'Setting tab:',
          foundTab,
        );
        setSelectedTab(foundTab);
      }
    }
  }, [statusFromParams]);

  useEffect(() => {
    resetAndFetchOrders();
  }, [selectedTab, selectedFilter]);

  const resetAndFetchOrders = () => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    fetchOrders(1, searchText, true);
  };

  const fetchOrders = async (pageNum = 1, search = '', isInitial = false) => {
    if (loadingRef.current && !isInitial) {
      return;
    }

    try {
      loadingRef.current = true;
      setError(null);

      if (isInitial) {
        setRefreshing(pageNum === 1);
        setIsInitialLoading(pageNum === 1 && data.length === 0);
        setHasMore(true);
      } else {
        setIsLoadingMore(true);
      }
      const shouldPassStaffId =
        user?.role === 'staff' && selectedFilter === 'assignedToMe';
      const staffId = shouldPassStaffId ? user?.id : null;
      const statusToPass = selectedTab.key === 'all' ? null : selectedTab.key;

      console.log(
        'Fetching orders for status:',
        statusToPass,
        'Page:',
        pageNum,
      );

      const response = await getAllOrdersAdmin(
        statusToPass, // Pass null for 'all', actual status for others
        pageNum,
        search,
        staffId, // Pass staffId as 4th parameter
      );

      if (response?.data?.status === 'success') {
        const fetchedOrders = response.data.data.orders || [];
        const pagination = response.data.data.pagination || {};
        const total = pagination.totalOrders || 0;
        const totalPages = pagination.totalPages || 0;
        const hasMoreData = pageNum < totalPages;

        setTotalCount(total);
        setHasMore(hasMoreData);

        if (pageNum === 1) {
          setData(fetchedOrders);
        } else {
          setData(prev => {
            const existingIds = new Set(prev.map(order => order.id));
            const newOrders = fetchedOrders.filter(
              order => !existingIds.has(order.id),
            );
            return [...prev, ...newOrders];
          });
        }

        setPage(pageNum);
      } else {
        throw new Error(response?.data?.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Failed to load orders');
      setHasMore(false);

      if (pageNum === 1) {
        setData([]);
      }
    } finally {
      setRefreshing(false);
      setIsLoadingMore(false);
      setIsInitialLoading(false);
      setIsTabChanging(false);
      setIsFilterChanging(false);
      setIsSearching(false);
      loadingRef.current = false;
    }
  };

  const handleTabChange = newTab => {
    if (newTab.key === selectedTab.key) return;
    setIsTabChanging(true);
    setSelectedTab(newTab);
    setSearchText('');

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  const handleSearchChange = text => {
    setSearchText(text);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (text !== searchText) return; // Prevent stale closure
      setIsSearching(true);
      debouncedSearch(text);
    }, 500);
  };

  const debouncedSearch = useCallback(
    debounce(text => {
      setPage(1);
      setData([]);
      setHasMore(true);
      fetchOrders(1, text, true);
    }, 300),
    [selectedTab, selectedFilter],
  );

  const handleLoadMore = () => {
    console.log('handleLoadMore called', {
      isLoadingMore,
      hasMore,
      loading: loadingRef.current,
      dataLength: data.length,
      currentPage: page,
    });

    if (!isLoadingMore && hasMore && !loadingRef.current && data.length > 0) {
      const nextPage = page + 1;
      console.log('Loading next page:', nextPage);
      fetchOrders(nextPage, searchText, false);
    }
  };

  const onRefresh = () => {
    if (!refreshing && !loadingRef.current) {
      setPage(1);
      setHasMore(true);
      setError(null);
      fetchOrders(1, searchText, true);
    }
  };

  const handleFilterSelect = filterKey => {
    setIsFilterChanging(true);
    setSelectedFilter(filterKey);
    setShowFilterPopover(false);
    setSearchText('');
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Check if any loading state is active
  const isAnyLoading =
    isTabChanging || isFilterChanging || isSearching || isInitialLoading;

  const renderOrderItem = ({item}) => (
    <View style={styles.orderCard}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
        <Typography
          title={`Order #${item.orderNumber}`}
          size={18}
          font={FONTS.INTER_SEMIBOLD}
        />
        {item?.createdAt && (
          <Typography
            title={moment(item.createdAt).format('DD/MM/YYYY')}
            font={FONTS.INTER_REGULAR}
            size={14}
            color={COLORS.APP_LABEL}
          />
        )}
      </View>

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
            {item?.totalItems || 0}
          </Text>
        </Text>
        <Text style={styles.labelText}>
          Subtotal:{' '}
          <Text
            style={[
              styles.valueText,
              {fontFamily: FONTS.INTER_SEMIBOLD, color: COLORS.APP_BLACK},
            ]}>
            ₹{item?.totalAmount?.toFixed(2) || '0.00'}
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
            navigation.navigate(Routes.AdminOrdersDetail, {orderId: item.id})
          }
          style={styles.detailsButton}>
          <Typography title={'Details'} size={14} font={FONTS.INTER_REGULAR} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
      }}>
      {error ? (
        <View style={{alignItems: 'center'}}>
          <Typography
            title="Failed to load orders"
            size={16}
            color={COLORS.APP_GRAY}
            font={FONTS.INTER_REGULAR}
          />
          <TouchableOpacity
            onPress={() => fetchOrders(1, searchText, true)}
            style={{
              marginTop: 10,
              padding: 10,
              backgroundColor: COLORS.APP_PRIMARY,
              borderRadius: 5,
            }}>
            <Typography
              title="Retry"
              size={14}
              color={COLORS.APP_WHITE}
              font={FONTS.INTER_MEDIUM}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <Typography
          title={
            searchText
              ? 'No orders found for your search'
              : selectedTab.key === 'all'
              ? 'No orders found'
              : `No ${selectedTab.title.toLowerCase()} orders found`
          }
          size={16}
          color={COLORS.APP_GRAY}
          font={FONTS.INTER_REGULAR}
        />
      )}
    </View>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={{padding: 20, alignItems: 'center'}}>
        <ActivityIndicator size="small" color={COLORS.APP_PRIMARY} />
        <Typography
          title="Loading more orders..."
          size={12}
          color={COLORS.APP_GRAY}
          font={FONTS.INTER_REGULAR}
          style={{marginTop: 5}}
        />
      </View>
    );
  };

  const renderFilterPopover = () => (
    <Modal
      visible={showFilterPopover}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowFilterPopover(false)}>
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
          paddingTop: 70,
          paddingRight: 16,
        }}
        activeOpacity={1}
        onPress={() => setShowFilterPopover(false)}>
        <View
          style={{
            backgroundColor: COLORS.APP_WHITE,
            borderRadius: 8,
            padding: 4,
            minWidth: 150,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}>
          {filterOptions.map(option => (
            <TouchableOpacity
              key={option.key}
              onPress={() => handleFilterSelect(option.key)}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor:
                  selectedFilter === option.key
                    ? COLORS.APP_PRIMARY + '20'
                    : 'transparent',
                borderRadius: 4,
              }}>
              <Typography
                title={option.title}
                size={14}
                color={
                  selectedFilter === option.key
                    ? COLORS.APP_PRIMARY
                    : COLORS.APP_BLACK
                }
                font={
                  selectedFilter === option.key
                    ? FONTS.INTER_MEDIUM
                    : FONTS.INTER_REGULAR
                }
              />
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderLoadingOverlay = () => {
    if (!isAnyLoading || isInitialLoading) return null;

    return (
      <View>
        <ActivityIndicator size="large" color={COLORS.APP_PRIMARY} />
      </View>
    );
  };

  if (isInitialLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <Typography title={'Orders'} size={18} font={FONTS.INTER_MEDIUM} />
          {user?.role === 'staff' && (
            <TouchableOpacity>
              <Image source={Images.filter} style={{height: 24, width: 24}} />
            </TouchableOpacity>
          )}
        </View>
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
      </SafeAreaView>
    );
  }

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
              navigation.navigate(Routes.AdminBottomStack, {
                screen: Routes.Dashboard,
              })
            }
            size={20}
            color={colors.primary}
          />
        </View>
        <Typography title={'Orders'} size={18} font={FONTS.INTER_MEDIUM} />
       
        {user?.role === 'staff' ? (
          <TouchableOpacity onPress={() => setShowFilterPopover(true)}>
            <Image source={Images.filter} style={{height: 24, width: 24}} />
          </TouchableOpacity>
        ) : (
         <View/>
        )}
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
          placeholder="Search orders..."
          value={searchText}
          onChangeText={handleSearchChange}
          placeholderTextColor={COLORS.APP_GRAY}
          style={styles.searchInput}
          returnKeyType="search"
          clearButtonMode="while-editing"
          editable={!isAnyLoading}
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
              ]}
              disabled={refreshing || isLoadingMore || isAnyLoading}>
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

      {/* Orders Count */}
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
      {data.length === 0 && !isInitialLoading && !isAnyLoading ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={data}
          renderItem={renderOrderItem}
          keyExtractor={(item, index) =>
            `${item.id}-${item.orderNumber}-${index}`
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.APP_PRIMARY]}
              tintColor={COLORS.APP_PRIMARY}
              enabled={!isAnyLoading}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{
            paddingBottom: 90,
            flexGrow: 1,
          }}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          scrollEnabled={!isAnyLoading}
        />
      )}

      {/* Filter Popover */}
      {renderFilterPopover()}

      {/* Loading Overlay */}
      {renderLoadingOverlay()}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigate(Routes.AddOrder)}>
        <AntDesign name="plus" size={22} color={COLORS.APP_WHITE} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Order;
