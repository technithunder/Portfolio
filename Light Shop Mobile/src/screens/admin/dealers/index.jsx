import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {debounce} from 'lodash';
import AntDesign from 'react-native-vector-icons/AntDesign';
//relative path imports
import styles from './style';
import {Images, Routes} from '../../../constants';
import {Container, Icon, Typography} from '../../../components';
import ItemList from '../../../components/ItemList';
import {COLORS} from '../../../theme/colors';
import {navigate} from '../../../utils';
import {useSelector} from 'react-redux';
import {deleteDealerAndStaff, getAllUsers} from '../../../api';
import DeleteModal from '../../../components/DeleteModal';
import Toast from 'react-native-toast-message';
import {verticalScale} from 'react-native-size-matters';
import {IS_IOS} from '../../../utils/helper';

const Dealers = ({navigation}) => {
  const user = useSelector(state => state.auth.user);
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

  useEffect(() => {
    fetchAllDealers(1, '', true);
  }, []);

  const debouncedSearch = useCallback(
    debounce(searchTerm => {
      fetchAllDealers(1, searchTerm, true);
    }, 500),
    [],
  );

  useEffect(() => {
    if (search.length > 0) {
      debouncedSearch(search);
    } else if (search.length === 0) {
      fetchAllDealers(1, '', true);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [search, debouncedSearch]);

  const fetchAllDealers = async (
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
      const response = await getAllUsers('dealer', pageNum, searchTerm, 10);
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
    fetchAllDealers(1, search, true);
  }, [search]);

  const handleLoadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore && data.length > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchAllDealers(nextPage, search, false);
    }
  }, [loading, loadingMore, hasMore, page, search, data.length]);

  const onEndReached = useCallback(() => {
    handleLoadMore();
  }, [handleLoadMore]);

  console.log('Dealers data:', data);

  const renderItem = ({item, index}) => {
    console.log('Item:', item);
    return (
      <ItemList
        type={false}
        item={item}
        onPress={() =>
          navigate(Routes.AdminDealersProfile, {dealerId: item?.BasicInfo?.id})
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
        <ActivityIndicator size="small" color={COLORS.APP_PRIMARY} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Typography
          title={
            search
              ? 'No dealers found for your search'
              : 'No dealers members found'
          }
          size={16}
          color={COLORS.APP_GRAY}
          style={{textAlign: 'center'}}
        />
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
        fetchAllDealers(1, '', true);
        setDeleteModalVisible(false);
        setSelectedItem(null);
        setIsLoading(false);
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
    }
  };

  const onCloseDeleteModal = () => {
    setDeleteModalVisible(false);
    setSelectedItem(null);
  };

  return (
    <Container
      title="Dealers"
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
              placeholder="Search dealer by name or ID"
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
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="small" color={COLORS.APP_PRIMARY} />
          </View>
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
                <Typography title={'No Dealer found'} />
              </View>
            )}
          </>
        )}
      </KeyboardAvoidingView>

      {user?.role !== 'staff' && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigate(Routes.AdminDealersEditProfile)}>
          <AntDesign name="plus" size={22} color={COLORS.APP_WHITE} />
        </TouchableOpacity>
      )}

      <DeleteModal
        onClose={onCloseDeleteModal}
        onConfirm={onConfirm}
        visible={deleteModalVisible}
        isLoading={isLoading}
        title="Delete Dealer"
        message="Are you sure you want to delete this dealer?"
      />
    </Container>
  );
};

export default Dealers;
