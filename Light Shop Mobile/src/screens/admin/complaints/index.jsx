import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Container, Icon, Typography} from '../../../components';
import {Routes} from '../../../constants';
import styles from './style';
import {COLORS} from '../../../theme/colors';
import {getAllComplaints} from '../../../api';

const Complaints = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: true,
  });

  useEffect(() => {
    fetchAllComplaints(1, true);
  }, []);

  const fetchAllComplaints = async (page = 1, isInitial = false) => {
    try {
      if (isInitial) {
        setIsLoading(true);
      } else if (page === 1) {
        setIsRefreshing(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await getAllComplaints(page);

      if (response?.data?.status === 'success') {
        const newData = response?.data?.data?.rows || [];
        const paginationData = {
          page: response?.data?.data?.page,
          pageSize: response?.data?.data?.pageSize,
          total: response?.data?.data?.total,
        };

        setPagination({
          ...paginationData,
          hasMore:
            paginationData.page * paginationData.pageSize <
            paginationData.total,
        });

        if (page === 1) {
          setData(newData);
        } else {
          setData(prevData => [...prevData, ...newData]);
        }

        console.log('==>Complaints Data', response?.data?.data);
      }
    } catch (e) {
      console.log('Error fetching complaints:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  const onRefresh = useCallback(() => {
    fetchAllComplaints(1);
  }, []);

  const loadMoreData = () => {
    if (!isLoadingMore && pagination.hasMore && !isLoading) {
      const nextPage = pagination.page + 1;
      fetchAllComplaints(nextPage);
    }
  };

  const renderComplaintItem = ({item}) => (
    <TouchableOpacity style={styles.complaintItem}>
      <View style={styles.complaintHeader}>
        <Text style={styles.orderNumber}>#{item.order?.orderNumber}</Text>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: getStatusColor(item.status)},
          ]}>
          <Text style={styles.statusText}>{item.status?.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.customerName}>{item.order?.customerName}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.complaintFooter}>
        <Text style={styles.priority}>Priority: {item.priority}</Text>
       <TouchableOpacity onPress={() => navigation.navigate(Routes.AdminViewComplaints,{complaintId:item.id})} style={styles.detailsButton}>
        <Typography title={"Details"} size={12}/>
       </TouchableOpacity>
      </View>

    
    </TouchableOpacity>
  );

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'open':
        return '#FF6B6B';
      case 'closed':
        return '#96CEB4';
      case 'in_progress':
        return '#4ECDC4';
      case 'resolved':
        return '#45B7D1';
      default:
        return '#95A5A6';
    }
  };

   

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator
          size="small"
          color={COLORS.APP_PRIMARY || '#007AFF'}
        />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Icon
          icon="AntDesign"
          name="exclamationcircleo"
          size={60}
          color={COLORS.APP_LIGHTER_GRAY}
        />
        <Text style={styles.emptyTitle}>No Complaints Found</Text>
        <Text style={styles.emptySubtitle}>
          {search
            ? 'Try adjusting your search criteria'
            : 'No complaints have been submitted yet'}
        </Text>
      </View>
    );
  };

  const filteredData = data.filter(
    item =>
      search === '' ||
      item.order?.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      item.order?.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Container
      title="Complaints"
      showBack={true}
      onLeftPress={() =>
        navigation.navigate(Routes.DrawerStack, {
          screen: Routes.AdminBottomStack,
          params: {
            screen: Routes.Dashboard,
          },
        })
      }
      style={[styles.container]}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputView}>
          <View style={{width: '10%'}}>
            <Icon
              icon="AntDesign"
              name="search1"
              size={16}
              color={COLORS.APP_LIGHTER_GRAY}
            />
          </View>
          <View style={{width: '90%'}}>
            <TextInput
              placeholder="Search complaints"
              onChangeText={setSearch}
              value={search}
              style={styles.searchInput}
              placeholderTextColor={COLORS.APP_LIGHTER_GRAY}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* <View style={styles.paginationInfo}>
          <Text style={styles.resultCount}>
            Showing {filteredData.length} of {pagination.total} complaints
          </Text>
        </View> */}

        {/* Complaints List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={COLORS.APP_PRIMARY || '#007AFF'}
            />
            <Text style={styles.loadingText}>Loading complaints...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderComplaintItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={[COLORS.APP_PRIMARY || '#007AFF']}
                tintColor={COLORS.APP_PRIMARY || '#007AFF'}
              />
            }
            onEndReached={search === '' ? loadMoreData : null}
            onEndReachedThreshold={0.1}
            ListFooterComponent={search === '' ? renderFooter : null}
            ListEmptyComponent={renderEmptyComponent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </KeyboardAvoidingView>
    </Container>
  );
};

export default Complaints;
