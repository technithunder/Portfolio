import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useEffect, useState, useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Routes} from '../../../constants';
import {dashboardAllDataApi} from '../../../api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style';
import {useSelector} from 'react-redux';
import {COLORS} from '../../../theme/colors';

const ViewComplaints = ({navigation}) => {
  const user = useSelector(state => state.auth.user);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    totalOrders: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    fetchComplaints(1, true);
  }, []);

  const fetchComplaints = async (page = 1, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await dashboardAllDataApi(page, 'active_complaints', 10);

      if (response?.data?.status === 'success') {
        const newComplaints = response?.data?.data?.leads || [];
        const paginationData = {
          totalOrders: response?.data?.data?.pagination?.totalOrders || 0,
          totalPages: response?.data?.data?.pagination?.totalPages || 1,
          currentPage: response?.data?.data?.pagination?.currentPage || 1,
          pageSize: response?.data?.data?.pagination?.pageSize || 10,
        };

        if (isInitial || page === 1) {
          setComplaints(newComplaints);
        } else {
          setComplaints(prev => [...prev, ...newComplaints]);
        }

        setPagination(paginationData);
        setHasMoreData(paginationData.currentPage < paginationData.totalPages);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch complaints. Please try again.');
      console.error('Fetch complaints error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchComplaints(1, true);
  }, []);

  const loadMoreComplaints = () => {
    if (!loadingMore && hasMoreData && complaints.length > 0) {
      const nextPage = pagination.currentPage + 1;
      fetchComplaints(nextPage, false);
    }
  };

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'open':
        return '#FF6B6B';
      case 'in_progress':
        return '#4ECDC4';
      case 'resolved':
        return '#45B7D1';
      case 'closed':
        return '#96CEB4';
      default:
        return '#95A5A6';
    }
  };

  const getPriorityColor = priority => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#E74C3C';
      case 'medium':
        return '#F39C12';
      case 'low':
        return '#27AE60';
      default:
        return '#95A5A6';
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderComplaintItem = ({item}) => (
    <TouchableOpacity onPress={() => navigation.navigate(Routes.AdminViewComplaints,{complaintId:item.id,isComplaints:true})} style={styles.complaintCard} activeOpacity={0.7}>
      <View style={styles.complaintHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.orderId}>
            {item.order?.orderNumber || `Order #${item.orderId}`}
          </Text>
          <Text style={styles.customerName}>
            Customer: {item.order?.customerName || 'N/A'}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            {user?.role === 'staff' ? (
              <>
                {item?.assignedStaff?.some(staff => staff.id === user?.id) && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(Routes.ManageNote, {
                        id: item?.id,
                        isComplaints: true,
                      })
                    }>
                    <Ionicons
                      name="chatbox-ellipses-outline"
                      size={24}
                      color={COLORS.APP_BLACK}
                    />
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(Routes.ManageNote, {
                    id: item?.id,
                    isComplaints: true,
                  })
                }>
                <Ionicons
                  name="chatbox-ellipses-outline"
                  size={24}
                  color={COLORS.APP_BLACK}
                />
              </TouchableOpacity>
            )}
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: getStatusColor(item.status)},
              ]}>
              <Text style={styles.statusText}>
                {item.status?.toUpperCase() || 'UNKNOWN'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.complaintContent}>
        <Text style={styles.description}>
          {item.description || 'No description available'}
        </Text>

        <View style={styles.metaInfo}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Priority:</Text>
            <View
              style={[
                styles.priorityBadge,
                {backgroundColor: getPriorityColor(item.priority)},
              ]}>
              <Text style={styles.priorityText}>
                {item.priority?.toUpperCase() || 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Created:</Text>
            <Text style={styles.metaValue}>
              {item.createdAt ? formatDate(item.createdAt) : 'N/A'}
            </Text>
          </View>

          {item.targetCloseDate && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Target Close:</Text>
              <Text style={styles.metaValue}>
                {formatDate(item.targetCloseDate)}
              </Text>
            </View>
          )}

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Complaint ID:</Text>
            <Text style={styles.metaValue}>#{item.id}</Text>
          </View>
        </View>

        {item.assignedStaff && item.assignedStaff.length > 0 && (
          <View style={styles.assignedStaff}>
            <Text style={styles.staffLabel}>Assigned to:</Text>
            <View style={styles.staffContainer}>
              {item.assignedStaff.map((staff, index) => (
                <View key={staff.id} style={styles.staffItem}>
                  <Text style={styles.staffName}>
                    {staff.firstName} {staff.lastName}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.APP_PRIMARY} />
        <Text style={styles.loadingText}>Loading more complaints...</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Complaints Found</Text>
      <Text style={styles.emptySubtitle}>
        There are no active complaints at the moment.
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.navigate(Routes.DrawerStack, {screen: Routes.Dashboard})
          }>
          <Icon name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>View Complaints</Text>
        <View style={styles.placeholder} />
      </View>
      <View />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.APP_PRIMARY} />
          <Text style={styles.loadingText}>Loading complaints...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View style={styles.headerStats}>
        <Text style={styles.statsText}>
          Showing {complaints.length} of {pagination.totalOrders} complaints
        </Text>
      </View>

      <FlatList
        data={complaints}
        keyExtractor={item => item.id.toString()}
        renderItem={renderComplaintItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        onEndReached={loadMoreComplaints}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </SafeAreaView>
  );
};

export default ViewComplaints;
