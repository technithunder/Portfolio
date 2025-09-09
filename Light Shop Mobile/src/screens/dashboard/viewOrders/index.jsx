import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Routes} from '../../../constants';
import {dashboardAllDataApi} from '../../../api';
import styles from './style';
import {COLORS} from '../../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';

const {width} = Dimensions.get('window');

// Enhanced Skeleton Component using react-native-skeleton-placeholder
const OrderSkeleton = () => (
  <SkeletonPlaceholder borderRadius={12}>
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <View style={{width: '60%', height: 16}} />
        <View style={{width: '25%', height: 20, borderRadius: 10}} />
      </View>
      <View style={styles.skeletonBody}>
        <View style={styles.skeletonImageContainer}>
          <View style={{width: 60, height: 60, borderRadius: 8}} />
        </View>
        <View style={styles.skeletonContent}>
          <View style={{width: '80%', height: 16, marginBottom: 8}} />
          <View style={{width: '60%', height: 14, marginBottom: 8}} />
          <View style={{width: '40%', height: 12}} />
        </View>
      </View>
      <View style={styles.skeletonFooter}>
        <View style={{width: '40%', height: 18}} />
        <View style={{width: '30%', height: 14}} />
      </View>
      <View style={styles.skeletonStaffSection}>
        <View style={{width: '30%', height: 12, marginBottom: 4}} />
        <View style={{width: '70%', height: 12}} />
      </View>
    </View>
  </SkeletonPlaceholder>
);

// Header Component
const HeaderComponent = ({navigation, totalOrders}) => (
  <View style={styles.headerContainer}>
    <View style={styles.headerContent}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          navigation.navigate(Routes.DrawerStack, {screen: Routes.Dashboard})
        }>
        <Icon name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>View Orders</Text>
      <View style={styles.placeholder} />
    </View>
    <View style={styles.subHeader}>
      <Text style={styles.allOrdersTitle}>All Orders</Text>
      <View style={styles.orderCountBadge}>
        <Text style={styles.orderCount}>
          {totalOrders} order{totalOrders !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  </View>
);

// Status Badge Component with enhanced styling
const StatusBadge = ({status}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'delivered':
        return {color: '#10B981', text: 'DELIVERED', icon: 'check-circle'};
      case 'order_placed':
        return {color: '#F59E0B', text: 'ORDER PLACED', icon: 'schedule'};
      case 'pending':
        return {color: '#EF4444', text: 'PENDING', icon: 'pending'};
      default:
        return {color: '#6B7280', text: status.toUpperCase(), icon: 'info'};
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.statusBadge, {backgroundColor: config.color}]}>
      <Icon
        name={config.icon}
        size={12}
        color={COLORS.APP_WHITE}
        style={styles.statusIcon}
      />
      <Text style={styles.statusText}>{config.text}</Text>
    </View>
  );
};

const ViewOrders = ({navigation}) => {
  const user = useSelector(state => state.auth.user);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    totalOrders: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });

  useEffect(() => {
    fetchAllOrders(1, true);
  }, []);
  console.log('==>126', orders);
  const fetchAllOrders = async (page = 1, isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setIsLoading(true);
      } else if (page === 1) {
        setIsRefreshing(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await dashboardAllDataApi(page, 'active_order', 5);

      if (response?.data?.status === 'success') {
        const newOrders = response?.data?.data?.orders || [];
        const paginationData = {
          totalOrders: response?.data?.data?.pagination?.totalOrders || 0,
          totalPages: response?.data?.data?.pagination?.totalPages || 1,
          currentPage: response?.data?.data?.pagination?.currentPage || 1,
          pageSize: response?.data?.data?.pagination?.pageSize || 10,
        };

        setPagination(paginationData);

        if (page === 1) {
          setOrders(newOrders);
        } else {
          setOrders(prevOrders => [...prevOrders, ...newOrders]);
        }
      }
    } catch (error) {
      console.log('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  const onRefresh = useCallback(() => {
    fetchAllOrders(1);
  }, []);

  const loadMoreOrders = () => {
    if (!isLoadingMore && pagination.currentPage < pagination.totalPages) {
      fetchAllOrders(pagination.currentPage + 1);
    }
  };

  const handleOrderPress = order => {
    console.log("==>order",order)
    navigation.navigate(Routes.AdminOrdersDetail, { orderId: order.id, isDashboard:true });
  };

  const OrderCard = ({order, onPress}) => (
    <TouchableOpacity onPress={onPress} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderNumberContainer}>
          <Icon
            name="receipt"
            size={16}
            color="#6B7280"
            style={styles.orderIcon}
          />
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          {user?.role === 'staff' ? (
            <>
              {order?.assignedStaff?.some(staff => staff.id === user?.id) && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(Routes.ManageNote, {
                      id: order?.id,
                      isOrder: true,
                    })
                  }>
                  <Ionicons name="chatbox-ellipses-outline" size={24} color={COLORS.APP_BLACK}/>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Routes.ManageNote, {
                  id: order?.id,
                  isOrder: true,
                })
              }>
              <Ionicons name="chatbox-ellipses-outline" size={24} color={COLORS.APP_BLACK}/>
            </TouchableOpacity>
          )}

          <StatusBadge status={order.status} />
        </View>
      </View>

      <View style={styles.orderBody}>
        <View style={styles.orderImageContainer}>
          <Image
            source={{uri: order.orderItems[0]?.product?.image[0]}}
            style={styles.orderImage}
            resizeMode="cover"
          />
          {order.totalItems > 1 && (
            <View style={styles.multipleItemsBadge}>
              <Text style={styles.multipleItemsText}>
                +{order.totalItems - 1}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.orderContent}>
          <View style={styles.customerSection}>
            <Icon name="person" size={14} color="#6B7280" />
            <Text style={styles.customerName}>{order.customerName}</Text>
          </View>

          <Text style={styles.productName} numberOfLines={1}>
            {order.orderItems[0]?.productName}
            {order.totalItems > 1 &&
              ` & ${order.totalItems - 1} more item${
                order.totalItems > 2 ? 's' : ''
              }`}
          </Text>

          <View style={styles.dateSection}>
            <Icon name="event" size={12} color="#9CA3AF" />
            <Text style={styles.orderDate}>
              Ordered:{' '}
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>

          {order.expectedDate && (
            <View style={styles.dateSection}>
              <Icon name="schedule" size={12} color="#9CA3AF" />
              <Text style={styles.expectedDate}>
                Expected:{' '}
                {new Date(order.expectedDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.amountSection}>
          <Text style={styles.totalAmount}>
            ₹{order.totalAmount.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.itemCount}>
            {order.totalItems} item{order.totalItems > 1 ? 's' : ''}
          </Text>
        </View>

        <View style={styles.approvalSection}>
          <View
            style={[
              styles.approvalBadge,
              {
                backgroundColor:
                  order.approvedStatus === 'approve' ? '#D1FAE5' : '#FEF3C7',
              },
            ]}>
            <Text
              style={[
                styles.approvalText,
                {
                  color:
                    order.approvedStatus === 'approve' ? '#059669' : '#D97706',
                },
              ]}>
              {order.approvedStatus === 'approve'
                ? 'APPROVED'
                : 'PENDING APPROVAL'}
            </Text>
          </View>
        </View>
      </View>

      {order.assignedStaff.length > 0 && (
        <View style={styles.staffSection}>
          <View style={styles.staffHeader}>
            <Icon name="group" size={14} color="#374151" />
            <Text style={styles.staffLabel}>Assigned Staff:</Text>
          </View>
          <Text style={styles.staffNames}>
            {order.assignedStaff.map(
              (staff, index) =>
                `${staff.firstName} ${staff.lastName}${
                  index < order.assignedStaff.length - 1 ? ', ' : ''
                }`,
            )}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderOrderItem = ({item}) => (
    <OrderCard order={item} onPress={() => handleOrderPress(item)} />
  );

  const renderSkeletonLoader = () => (
    <View>
      {[1, 2, 3, 4, 5].map(item => (
        <OrderSkeleton key={item} />
      ))}
    </View>
  );

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color={COLORS.APP_PRIMARY} />
          <Text style={styles.loadingText}>Loading more orders...</Text>
        </View>
      );
    }

    if (orders.length > 0 && pagination.currentPage >= pagination.totalPages) {
      return (
        <View style={styles.endMessage}>
          <Text style={styles.endMessageText}>You've reached the end</Text>
        </View>
      );
    }

    return null;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="inventory" size={64} color="#D1D5DB" />
      <Text style={styles.emptyStateTitle}>No Orders Found</Text>
      <Text style={styles.emptyStateSubtitle}>
        There are no orders to display at the moment.{'\n'}
        Pull down to refresh or check back later.
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderComponent navigation={navigation} totalOrders={0} />
        <View style={styles.container}>{renderSkeletonLoader()}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderComponent
        navigation={navigation}
        totalOrders={pagination.totalOrders}
      />
      <View style={styles.container}>
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[COLORS.APP_PRIMARY]}
              tintColor={COLORS.APP_PRIMARY}
              title="Pull to refresh"
              titleColor="#6B7280"
            />
          }
          onEndReached={loadMoreOrders}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={!isLoading ? renderEmptyState : null}
          contentContainerStyle={
            orders.length === 0 ? styles.emptyContainer : styles.listContainer
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ViewOrders;
