import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {debounce} from 'lodash';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
//relative path imports
import styles from './style';
import {Images, Routes} from '../../../constants';
import {Container, Icon, Typography} from '../../../components';
import {COLORS} from '../../../theme/colors';
import ItemList from '../../../components/ItemList';
import {navigate} from '../../../utils';
import {deleteDealerAndStaff, getAllUsers} from '../../../api';
import DeleteModal from '../../../components/DeleteModal';
import Toast from 'react-native-toast-message';
import {verticalScale} from 'react-native-size-matters';
import {IS_IOS} from '../../../utils/helper';

// Skeleton Component for Staff List Item
const StaffSkeleton = () => {
  return (
    <SkeletonPlaceholder
      borderRadius={4}
      backgroundColor={COLORS.APP_LIGHT_GRAY || '#E1E9EE'}
      highlightColor={COLORS.APP_WHITE || '#F2F8FC'}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 15,
          paddingHorizontal: 10,
          marginVertical: 8,
          backgroundColor: COLORS.APP_WHITE || '#FFFFFF',
          borderRadius: 12,
          marginHorizontal: 5,
        }}>
        {/* Profile Image Skeleton */}
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            marginRight: 15,
          }}
        />

        {/* Staff Details Skeleton */}
        <View style={{flex: 1}}>
          {/* Staff Name */}
          <View
            style={{
              height: 16,
              width: '70%',
              borderRadius: 4,
              marginBottom: 8,
            }}
          />
          {/* Staff ID */}
          <View
            style={{
              height: 14,
              width: '40%',
              borderRadius: 4,
              marginBottom: 6,
            }}
          />
          {/* Staff Position */}
          <View
            style={{
              height: 12,
              width: '60%',
              borderRadius: 4,
            }}
          />
        </View>

        {/* Action Button Skeleton */}
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            marginLeft: 10,
          }}
        />
      </View>
    </SkeletonPlaceholder>
  );
};

const Staff = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      console.log('Staff screen focused - refreshing data');
      resetAndRefresh();
    }, []),
  );

  const resetAndRefresh = () => {
    setPage(1);
    setData([]);
    setHasMore(true);
    setLoading(true);
    setLoadingMore(false);
    setRefreshing(false);
    setSearch('');
    fetchAllStaff(1, '', true);
  };

  useEffect(() => {
    // fetchAllStaff(1, '', true);
  }, []);

  const debouncedSearch = useCallback(
    debounce(searchTerm => {
      fetchAllStaff(1, searchTerm, true);
    }, 500),
    [],
  );

  useEffect(() => {
    if (search.length > 0) {
      debouncedSearch(search);
    } else if (search.length === 0) {
      if (data.length > 0) {
        fetchAllStaff(1, '', true);
      }
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [search, debouncedSearch]);

  const fetchAllStaff = async (
    pageNum = 1,
    searchTerm = '',
    isNewSearch = false,
  ) => {
    if (loading || (loadingMore && !isNewSearch)) return;

    if (!isNewSearch && !hasMore) return;

    if (isNewSearch || pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await getAllUsers('staff', pageNum, searchTerm, 10);
      if (response?.data?.status === 'success') {
        const newData = response?.data?.data?.users || [];

        if (isNewSearch || pageNum === 1) {
          setData(newData);
          setPage(1);
        } else {
          setData(prevData => [...prevData, ...newData]);
        }

        setHasMore(newData.length === 10);

        if (!isNewSearch && pageNum > 1) {
          setPage(pageNum);
        }
      } else {
        console.log('API Error:', response?.data?.message || 'Unknown error');
      }
    } catch (error) {
      console.log('Network Error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchAllStaff(1, search, true);
  }, [search]);

  const handleLoadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore && data.length > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchAllStaff(nextPage, search, false);
    }
  }, [loading, loadingMore, hasMore, page, search, data.length]);

  const onEndReached = useCallback(() => {
    handleLoadMore();
  }, [handleLoadMore]);

  const renderItem = ({item, index}) => {
    return (
      <ItemList
        item={item}
        onPress={() =>
          navigate(Routes.AdminStaffProfile, {staffId: item?.BasicInfo?.id})
        }
        onPressDeleteIcon={() => {
          setSelectedItem(item?.BasicInfo?.id);
          setDeleteModalVisible(true);
        }}
      />
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        {/* Show skeleton items when loading more */}
        {Array.from({length: 3}, (_, index) => (
          <StaffSkeleton key={`loadmore-skeleton-${index}`} />
        ))}
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Typography
          title={
            search ? 'No staff found for your search' : 'No staff members found'
          }
          size={16}
          color={COLORS.APP_GRAY}
          style={{textAlign: 'center'}}
        />
      </View>
    );
  };

  const renderSkeletonLoader = () => {
    return (
      <View style={{paddingHorizontal: 20, paddingTop: 10}}>
        {Array.from({length: 8}, (_, index) => (
          <StaffSkeleton key={`initial-skeleton-${index}`} />
        ))}
      </View>
    );
  };

  const onConfirm = async () => {
    try {
      setIsLoading(true);
      const response = await deleteDealerAndStaff(selectedItem);
      if (response?.data?.status === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Dealer deleted successfully',
          topOffset: verticalScale(IS_IOS ? 60 : 40),
        });
        onRefresh();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response?.data?.message || 'Failed to delete dealer',
          topOffset: verticalScale(IS_IOS ? 60 : 40),
        });
      }
    } catch (e) {
      console.log('Error deleting dealer:', e);
    } finally {
      setDeleteModalVisible(false);
      setSelectedItem(null);
      setIsLoading(false);
      onRefresh();
    }
  };

  const onCloseDeleteModal = () => {
    setDeleteModalVisible(false);
    setSelectedItem(null);
  };

  return (
    <Container
      title="Staff"
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
              placeholder="Search staff by name and ID and position"
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

        {loading ? (
          // Show skeleton loader instead of simple activity indicator
          renderSkeletonLoader()
        ) : (
          <>
            {data?.length > 0 ? (
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) =>
                  item.id?.toString() || index.toString()
                }
                contentContainerStyle={{
                  paddingBottom: 100,
                  paddingHorizontal: 20,
                  flexGrow: 1,
                }}
                showsVerticalScrollIndicator={false}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[COLORS.APP_PRIMARY]}
                    tintColor={COLORS.APP_PRIMARY}
                  />
                }
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
                initialNumToRender={10}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Typography title={'No Staff found'} />
              </View>
            )}
          </>
        )}
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigate(Routes.AdminStaffEditProfile)}>
        <AntDesign name="plus" size={22} color={COLORS.APP_WHITE} />
      </TouchableOpacity>

      <DeleteModal
        onClose={onCloseDeleteModal}
        onConfirm={onConfirm}
        visible={deleteModalVisible}
        isLoading={isLoading}
        title="Delete Staff"
        message="Are you sure you want to delete this staff?"
      />
    </Container>
  );
};

export default Staff;
