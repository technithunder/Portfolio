import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Linking,
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
import moment from 'moment';
import {useRoute} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const LeadSkeleton = () => (
  <SkeletonPlaceholder borderRadius={12}>
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <View style={{width: '70%', height: 18}} />
        <View style={{width: '20%', height: 16, borderRadius: 8}} />
      </View>
      <View style={styles.skeletonBody}>
        <View style={styles.skeletonContent}>
          <View style={{width: '60%', height: 14, marginBottom: 8}} />
          <View style={{width: '50%', height: 14, marginBottom: 8}} />
          <View style={{width: '80%', height: 14, marginBottom: 8}} />
          <View style={{width: '40%', height: 12}} />
        </View>
      </View>
      <View style={styles.skeletonFooter}>
        <View style={{width: '30%', height: 14}} />
        <View style={{width: '25%', height: 14}} />
      </View>
    </View>
  </SkeletonPlaceholder>
);

const HeaderComponent = ({navigation, totalLeads}) => (
  <View style={styles.headerContainer}>
    <View style={styles.headerContent}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          navigation.navigate(Routes.DrawerStack, {screen: Routes.Dashboard})
        }>
        <Icon name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Today's Leads</Text>
      <View style={styles.placeholder} />
    </View>
    <View style={styles.subHeader}>
      <Text style={styles.allLeadsTitle}>All Leads</Text>
      <View style={styles.leadCountBadge}>
        <Text style={styles.leadCount}>
          {totalLeads} lead{totalLeads !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  </View>
);

const LeadTypeBadge = ({type}) => {
  const getTypeConfig = () => {
    switch (type?.toLowerCase()) {
      case 'hot':
        return {color: '#EF4444', text: 'HOT', icon: 'local-fire-department'};
      case 'warm':
        return {color: '#F59E0B', text: 'WARM', icon: 'whatshot'};
      case 'cold':
        return {color: '#3B82F6', text: 'COLD', icon: 'ac-unit'};
      default:
        return {
          color: '#6B7280',
          text: type?.toUpperCase() || 'UNKNOWN',
          icon: 'help',
        };
    }
  };

  const config = getTypeConfig();

  return (
    <View style={[styles.typeBadge, {backgroundColor: config.color}]}>
      <Icon
        name={config.icon}
        size={12}
        color="#FFFFFF"
        style={styles.typeIcon}
      />
      <Text style={styles.typeText}>{config.text}</Text>
    </View>
  );
};

const ViewLead = ({navigation}) => {
  const user = useSelector(state => state.auth.user);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    totalLeads: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });

  console.log(leads);

  useEffect(() => {
    fetchAllLeads(1, true);
  }, []);

  const fetchAllLeads = async (page = 1, isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setIsLoading(true);
      } else if (page === 1) {
        setIsRefreshing(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await dashboardAllDataApi(
        page,
        'active_lead',
        10,
        moment().format('YYYY-MM-DD'),
      );

      if (response?.data?.status === 'success') {
        const newLeads = response?.data?.data?.leads || [];
        const paginationData = {
          totalLeads: response?.data?.data?.pagination?.totalOrders || 0,
          totalPages: response?.data?.data?.pagination?.totalPages || 1,
          currentPage: response?.data?.data?.pagination?.currentPage || 1,
          pageSize: response?.data?.data?.pagination?.pageSize || 10,
        };

        setPagination(paginationData);

        if (page === 1) {
          setLeads(newLeads);
        } else {
          setLeads(prevLeads => [...prevLeads, ...newLeads]);
        }
      }
    } catch (error) {
      console.log('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  const onRefresh = useCallback(() => {
    fetchAllLeads(1);
  }, []);

  const loadMoreLeads = () => {
    if (!isLoadingMore && pagination.currentPage < pagination.totalPages) {
      fetchAllLeads(pagination.currentPage + 1);
    }
  };

  const handleLeadPress = lead => {
    navigation.navigate(Routes.AdminLeadView, {
      leadId: lead.id,
      isTodayLead: true,
    });
  };

  const LeadCard = ({lead, onPress, onCall, onEmail}) => (
    <TouchableOpacity onPress={onPress} style={styles.leadCard}>
      <View style={styles.leadHeader}>
        <View style={styles.leadNameContainer}>
          <Icon
            name="person"
            size={16}
            color="#6B7280"
            style={styles.leadIcon}
          />
          <Text style={styles.customerName} numberOfLines={1}>
            {lead.customerName}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          {user?.role === 'staff' ? (
            <>
              {lead?.assignedStaff?.some(staff => staff.id === user?.id) && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(Routes.ManageNote, {
                      id: lead?.id,
                      isTodayLead: true,
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
                  id: lead?.id,
                  isTodayLead: true,
                })
              }>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={24}
                color={COLORS.APP_BLACK}
              />
            </TouchableOpacity>
          )}
          <LeadTypeBadge type={lead.type} />
        </View>
      </View>

      <View style={styles.leadBody}>
        <View style={styles.contactSection}>
          <View style={styles.contactItem}>
            <Icon name="phone" size={14} color="#059669" />
            <Text style={styles.contactText}>{lead.mobileNumber}</Text>
          </View>

          <View style={styles.contactItem}>
            <Icon name="email" size={14} color="#3B82F6" />
            <Text style={styles.contactText} numberOfLines={1}>
              {lead.email}
            </Text>
          </View>
        </View>

        {lead.requirement && (
          <View style={styles.requirementSection}>
            <Icon name="assignment" size={14} color="#6B7280" />
            <Text style={styles.requirementText} numberOfLines={2}>
              {lead.requirement}
            </Text>
          </View>
        )}

        {lead.summary && (
          <View style={styles.summarySection}>
            <Icon name="notes" size={14} color="#6B7280" />
            <Text style={styles.summaryText} numberOfLines={2}>
              {lead.summary}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.leadFooter}>
        <View style={styles.dateSection}>
          <Icon name="event" size={12} color="#9CA3AF" />
          <Text style={styles.createdDate}>
            Created:{' '}
            {new Date(lead.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </View>

        {lead?.followUpDate && (
          <View style={styles.followUpSection}>
            <Icon name="schedule" size={12} color="#F59E0B" />
            <Text style={styles.followUpDate}>
              Follow-up:{' '}
              {new Date(lead.followUpDate).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
        )}
      </View>

      {lead?.assignedStaff?.length > 0 && (
        <View style={styles.staffSection}>
          <View style={styles.staffHeader}>
            <Icon name="group" size={14} color="#374151" />
            <Text style={styles.staffLabel}>Assigned Staff:</Text>
          </View>
          <Text style={styles.staffNames}>
            {lead?.assignedStaff?.map(
              (staff, index) =>
                `${staff.firstName} ${staff.lastName}${
                  index < lead?.assignedStaff.length - 1 ? ', ' : ''
                }`,
            )}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderLeadItem = ({item}) => (
    <LeadCard lead={item} onPress={() => handleLeadPress(item)} />
  );

  const renderSkeletonLoader = () => (
    <View>
      {[1, 2, 3, 4, 5].map(item => (
        <LeadSkeleton key={item} />
      ))}
    </View>
  );

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color={COLORS.APP_PRIMARY} />
          <Text style={styles.loadingText}>Loading more leads...</Text>
        </View>
      );
    }

    if (leads.length > 0 && pagination.currentPage >= pagination.totalPages) {
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
      <Icon name="group-add" size={64} color="#D1D5DB" />
      <Text style={styles.emptyStateTitle}>No Leads Found</Text>
      <Text style={styles.emptyStateSubtitle}>
        There are no leads to display at the moment.{'\n'}
        Pull down to refresh or check back later.
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderComponent navigation={navigation} totalLeads={0} />
        <View style={styles.container}>{renderSkeletonLoader()}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderComponent
        navigation={navigation}
        totalLeads={pagination.totalLeads}
      />
      <View style={styles.container}>
        <FlatList
          data={leads}
          renderItem={renderLeadItem}
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
          onEndReached={loadMoreLeads}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={!isLoading ? renderEmptyState : null}
          contentContainerStyle={
            leads.length === 0 ? styles.emptyContainer : styles.listContainer
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ViewLead;
