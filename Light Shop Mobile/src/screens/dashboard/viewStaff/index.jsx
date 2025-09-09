import React, {useEffect, useState, useCallback, useRef} from 'react';
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
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Routes} from '../../../constants';
import {dashboardAllDataApi} from '../../../api';
import styles from './style';
import { COLORS } from '../../../theme/colors';

const {width} = Dimensions.get('window');

// Enhanced Skeleton Component using react-native-skeleton-placeholder
const StaffSkeleton = () => (
  <SkeletonPlaceholder borderRadius={12}>
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonProfileSection}>
          <View style={{width: 50, height: 50, borderRadius: 25}} />
          <View style={styles.skeletonNameSection}>
            <View style={{width: '70%', height: 16}} />
            <View style={{width: '50%', height: 14, marginTop: 4}} />
          </View>
        </View>
        <View style={{width: 30, height: 30, borderRadius: 15}} />
      </View>
      <View style={styles.skeletonStats}>
        <View style={styles.skeletonStatItem}>
          <View style={{width: '100%', height: 14}} />
          <View style={{width: '60%', height: 20, marginTop: 4}} />
        </View>
        <View style={styles.skeletonStatItem}>
          <View style={{width: '100%', height: 14}} />
          <View style={{width: '60%', height: 20, marginTop: 4}} />
        </View>
        <View style={styles.skeletonStatItem}>
          <View style={{width: '100%', height: 14}} />
          <View style={{width: '60%', height: 20, marginTop: 4}} />
        </View>
      </View>
      <View style={styles.skeletonPerformance}>
        <View style={{width: '40%', height: 16}} />
        <View
          style={{width: '30%', height: 24, borderRadius: 12, marginTop: 4}}
        />
      </View>
    </View>
  </SkeletonPlaceholder>
);

// Header Component
const HeaderComponent = ({navigation, totalStaff}) => (
  <View style={styles.headerContainer}>
    <View style={styles.headerContent}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          navigation.navigate(Routes.DrawerStack, {screen: Routes.Dashboard})
        }>
        <Icon name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Staff Leaderboard</Text>
      <View style={styles.placeholder} />
    </View>
    <View style={styles.subHeader}>
      <Text style={styles.allStaffTitle}>Team Performance</Text>
      <View style={styles.staffCountBadge}>
        <Text style={styles.staffCount}>
          {totalStaff} staff member{totalStaff !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  </View>
);

// Rank Badge Component
const RankBadge = ({rank}) => {
  const getRankConfig = () => {
    switch (rank) {
      case 1:
        return {color: '#FFD700', icon: 'emoji-events', textColor: '#B45309'};
      case 2:
        return {color: '#C0C0C0', icon: 'emoji-events', textColor: '#6B7280'};
      case 3:
        return {color: '#CD7F32', icon: 'emoji-events', textColor: '#92400E'};
      default:
        return {color: '#F3F4F6', icon: 'person', textColor: '#374151'};
    }
  };

  const config = getRankConfig();

  return (
    <View style={[styles.rankBadge, {backgroundColor: config.color}]}>
      {rank <= 3 ? (
        <Icon name={config.icon} size={16} color={config.textColor} />
      ) : (
        <Text style={[styles.rankText, {color: config.textColor}]}>
          #{rank}
        </Text>
      )}
    </View>
  );
};

// Performance Bar Component
const PerformanceBar = ({percentage, color = '#10B981'}) => (
  <View style={styles.performanceBarContainer}>
    <View style={styles.performanceBarBackground}>
      <View
        style={[
          styles.performanceBarFill,
          {
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
    <Text style={styles.performanceText}>{percentage}%</Text>
  </View>
);

// Enhanced Staff Card Component with Complaints
const StaffCard = ({staff, onPress}) => (
  <TouchableOpacity style={styles.staffCard} onPress={() => onPress(staff)}>
    <View style={styles.staffHeader}>
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {staff.image ? (
            <Image source={{uri: staff.image}} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size={24} color="#9CA3AF" />
            </View>
          )}
        </View>
        <View style={styles.nameSection}>
          <Text style={styles.staffName}>
            {staff.firstName} {staff.lastName}
          </Text>
          <Text style={styles.staffId}>ID: {staff.empId}</Text>
        </View>
      </View>
      <RankBadge rank={staff.rank} />
    </View>

    {/* Updated Stats Section with 3 columns */}
    <View style={styles.statsSection}>
      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Orders</Text>
          <Text style={styles.statValue}>
            {staff.ordersDelivered}/{staff.ordersAssigned}
          </Text>
          <PerformanceBar
            percentage={staff.ordersSuccess}
            color={
              staff.ordersSuccess >= 80
                ? '#10B981'
                : staff.ordersSuccess >= 50
                ? '#F59E0B'
                : '#EF4444'
            }
          />
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Leads</Text>
          <Text style={styles.statValue}>
            {staff.leadsConverted}/{staff.leadsAssigned}
          </Text>
          <PerformanceBar
            percentage={staff.leadsSuccess}
            color={
              staff.leadsSuccess >= 80
                ? '#10B981'
                : staff.leadsSuccess >= 50
                ? '#F59E0B'
                : '#EF4444'
            }
          />
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Complaints</Text>
          <Text style={styles.statValue}>
            {staff.complaintsResolved}/{staff.complaintsAssigned}
          </Text>
          <PerformanceBar
            percentage={staff.complaintsSuccess}
            color={
              staff.complaintsSuccess >= 80
                ? '#10B981'
                : staff.complaintsSuccess >= 50
                ? '#F59E0B'
                : '#EF4444'
            }
          />
        </View>
      </View>
    </View>

    <View style={styles.performanceSection}>
      <Text style={styles.performanceLabel}>Overall Performance</Text>
      <View style={styles.overallPerformanceContainer}>
        <PerformanceBar
          percentage={staff.overallPerformance}
          color={
            staff.overallPerformance >= 80
              ? '#10B981'
              : staff.overallPerformance >= 50
              ? '#F59E0B'
              : '#EF4444'
          }
        />
      </View>
    </View>

    {/* Updated Details Section with Complaints */}
    <View style={styles.detailsSection}>
      <View style={styles.detailItem}>
        <Icon name="assignment-turned-in" size={14} color="#059669" />
        <Text style={styles.detailText}>
          Orders: {staff.ordersSuccess}%
        </Text>
      </View>
      <View style={styles.detailItem}>
        <Icon name="trending-up" size={14} color="#3B82F6" />
        <Text style={styles.detailText}>
          Leads: {staff.leadsSuccess}%
        </Text>
      </View>
      <View style={styles.detailItem}>
        <Icon name="support-agent" size={14} color="#DC2626" />
        <Text style={styles.detailText}>
          Complaints: {staff.complaintsSuccess}%
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const ViewStaff = ({navigation}) => {
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    totalStaff: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
    hasNextPage: true,
  });

  const loadingRef = useRef(false);

  useEffect(() => {
    fetchAllStaff(1, true);
  }, []);

  const fetchAllStaff = async (page = 1, isInitialLoad = false) => {
    try {
      if (loadingRef.current && !isInitialLoad) {
        console.log('Request already in progress, skipping...');
        return;
      }

      loadingRef.current = true;

      if (isInitialLoad) {
        setIsLoading(true);
      } else if (page === 1) {
        setIsRefreshing(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await dashboardAllDataApi(page, 'active_staff', 5);

      if (response?.data?.status === 'success') {
        const newStaff = response?.data?.data?.leaderboard || [];
        const totalPages = response?.data?.data?.pagination?.totalPages || 1;
        const totalStaff = response?.data?.data?.pagination?.totalStaff || 0;

        const paginationData = {
          totalStaff,
          totalPages,
          currentPage: page,
          pageSize: response?.data?.data?.pageSize || 10,
          hasNextPage: page < totalPages,
        };

        console.log('Pagination data:', paginationData);
        console.log('New staff count:', newStaff.length);

        // Update pagination state
        setPagination(paginationData);

        if (page === 1) {
          // First page or refresh
          setStaffList(newStaff);
        } else {
          // Append new data
          setStaffList(prevStaff => {
            const existingIds = new Set(prevStaff.map(staff => staff.id));
            const filteredNewStaff = newStaff.filter(
              staff => !existingIds.has(staff.id),
            );
            const updatedList = [...prevStaff, ...filteredNewStaff];
            console.log(`Total staff after append: ${updatedList.length}`);
            return updatedList;
          });
        }
      } else {
        console.log('API response failed:', response?.data);
      }
    } catch (error) {
      console.log('Error fetching staff:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
      loadingRef.current = false;
    }
  };

  const onRefresh = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      hasNextPage: true,
    }));
    fetchAllStaff(1);
  }, []);

  const loadMoreStaff = useCallback(() => {
    if (
      !isLoadingMore &&
      !loadingRef.current &&
      pagination.hasNextPage &&
      pagination.currentPage < pagination.totalPages
    ) {
      const nextPage = pagination.currentPage + 1;
      console.log(`Loading page ${nextPage}`);

      setPagination(prev => ({
        ...prev,
        currentPage: nextPage,
      }));

      fetchAllStaff(nextPage);
    } else {
      console.log('Cannot load more:', {
        isLoadingMore,
        loadingRefCurrent: loadingRef.current,
        hasNextPage: pagination.hasNextPage,
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
      });
    }
  }, [
    isLoadingMore,
    pagination.hasNextPage,
    pagination.currentPage,
    pagination.totalPages,
  ]);

  const handleStaffPress = staff => {
    console.log('Staff pressed:', staff.firstName + ' ' + staff.lastName);
    // navigation.navigate(Routes.StaffDetails, { staffId: staff.id, staff: staff });
  };

  const renderStaffItem = ({item}) => (
    <StaffCard staff={item} onPress={handleStaffPress} />
  );

  const renderSkeletonLoader = () => (
    <View>
      {[1, 2, 3, 4, 5].map(item => (
        <StaffSkeleton key={item} />
      ))}
    </View>
  );

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color={COLORS.APP_PRIMARY} />
          <Text style={styles.loadingText}>Loading more staff...</Text>
        </View>
      );
    }

    if (staffList.length > 0 && !pagination.hasNextPage) {
      return (
        <View style={styles.endMessage}>
          <Text style={styles.endMessageText}>You've reached the end</Text>
          <Text style={styles.endMessageSubtext}>
            Showing all {staffList.length} staff members
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="groups" size={64} color="#D1D5DB" />
      <Text style={styles.emptyStateTitle}>No Staff Found</Text>
      <Text style={styles.emptyStateSubtitle}>
        There are no staff members to display at the moment.{'\n'}
        Pull down to refresh or check back later.
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderComponent navigation={navigation} totalStaff={0} />
        <View style={styles.container}>{renderSkeletonLoader()}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderComponent
        navigation={navigation}
        totalStaff={pagination.totalStaff}
      />
      <View style={styles.container}>
        <FlatList
          data={staffList}
          renderItem={renderStaffItem}
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
          onEndReached={loadMoreStaff}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={!isLoading ? renderEmptyState : null}
          contentContainerStyle={
            staffList.length === 0
              ? styles.emptyContainer
              : styles.listContainer
          }
          // Optimization props
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={10}
          updateCellsBatchingPeriod={50}
        />
      </View>
    </SafeAreaView>
  );
};

export default ViewStaff;