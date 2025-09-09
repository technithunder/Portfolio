import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {Container, Icon, Typography} from '../../../components';
import {Images} from '../../../constants';
import styles from './style';
import {COLORS} from '../../../theme/colors';
import {getAllDeletedUser, restoreUser} from '../../../api';
import FastImage from 'react-native-fast-image';
import {FONTS} from '../../../constants/fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RetriveUserModal from './components';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Toast from 'react-native-toast-message';

const obj = {
  staff: 'Staff',
  dealer: 'Dealer',
};

const SkeletonItem = () => (
  <SkeletonPlaceholder borderRadius={4}>
    <View style={styles.listContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
        <View style={[styles.userPicture]} />
        <View>
          <View
            style={{
              width: 120,
              height: 18,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              width: 150,
              height: 12,
              marginBottom: 4,
            }}
          />
          <View
            style={{
              width: 80,
              height: 12,
            }}
          />
        </View>
      </View>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
        }}
      />
    </View>
  </SkeletonPlaceholder>
);

const RecycleBin = () => {
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    fetchAllDeletedUser(true);
  }, []);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (searchQuery !== search) {
        setSearchQuery(search);
        setPage(1);
        setHasMore(true);
        fetchAllDeletedUser(true, search);
      }
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [search]);

  const fetchAllDeletedUser = async (
    isFirstPage = false,
    searchTerm = searchQuery,
    pageNumber = page,
  ) => {
    if (loadingMore || (!hasMore && !isFirstPage) || loading) return;

    if (isFirstPage) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await getAllDeletedUser(pageNumber, searchTerm);
      const newData = response?.data?.data?.users || [];
      const pageSize = response?.data?.data?.pageSize;
      const currentPage = response?.data?.data?.page;
      const total = response?.data?.data?.total;

      if (response?.data?.status) {
        if (isFirstPage) {
          setData(newData);
        } else {
          setData(prevData => [...prevData, ...newData]);
        }

        const totalPages = Math.ceil(total / pageSize);
        setHasMore(currentPage < totalPages);

        if (!isFirstPage) {
          setPage(pageNumber + 1);
        }
      } else {
        if (isFirstPage) {
          setData([]);
        }
        setHasMore(false);
      }
    } catch (e) {
      console.log('Error fetching deleted users:', e);
      if (isFirstPage) {
        setData([]);
      }
      setHasMore(false);
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
    fetchAllDeletedUser(true, searchQuery, 1);
  }, [searchQuery]);

  const onEndReached = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      fetchAllDeletedUser(false, searchQuery, page);
    }
  }, [hasMore, loadingMore, loading, searchQuery, page]);

  const onPress = id => {
    setId(id);
    setIsVisibleModal(true);
  };

  const onClose = () => {
    setId(null);
    setIsVisibleModal(false);
  };

  const onConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await restoreUser(id);
      if (response?.data?.status) {
        onClose();
        onRefresh();
        Toast.show({
          text1: response?.data?.message,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.listContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
          {item?.profilePic ? (
            <FastImage
              source={{uri: item?.PersonalInfo?.profilePic}}
              style={styles.userPicture}
            />
          ) : (
            <Image source={Images.user} style={styles.userPicture} />
          )}
          <View>
            {item?.firstName ? (
              <Typography
                title={item?.firstName + ' ' + item?.lastName}
                size={18}
                font={FONTS.INTER_MEDIUM}
              />
            ) : (
              <Typography
                title={'Deleted User'}
                size={18}
                font={FONTS.INTER_MEDIUM}
              />
            )}
            {item?.email && (
              <Typography
                title={`Email: ${item?.email}`}
                size={12}
                mt={5}
                font={FONTS.INTER_REGULAR}
                color={COLORS.APP_GRAY}
              />
            )}

            {item?.role && (
              <Typography
                title={`Role: ${obj[item?.role] || 'N/A'}`}
                size={12}
                mt={2}
                font={FONTS.INTER_REGULAR}
                color={COLORS.APP_GRAY}
              />
            )}
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
          <TouchableOpacity onPress={() => onPress(item.id)}>
            <FontAwesome5 name="undo-alt" size={22} color={COLORS.APP_GRAY} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={{paddingVertical: 20, alignItems: 'center'}}>
        <ActivityIndicator size="small" color={COLORS.PRIMARY} />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (loading) return null;

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 50,
        }}>
        <Typography
          title={
            search
              ? 'No deleted users found for your search'
              : 'No deleted users found'
          }
          size={16}
          font={FONTS.INTER_REGULAR}
          color={COLORS.APP_GRAY}
          textAlign="center"
        />
      </View>
    );
  };

  const renderSkeletonList = () => {
    return (
      <SkeletonPlaceholder borderRadius={4}>
        <View>
          {Array.from({length: 8}, (_, index) => (
            <View key={`skeleton-${index}`} style={styles.listContainer}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                <View style={[styles.userPicture]} />
                <View>
                  <View
                    style={{
                      width: 120,
                      height: 18,
                      marginBottom: 8,
                    }}
                  />
                  <View
                    style={{
                      width: 150,
                      height: 12,
                      marginBottom: 4,
                    }}
                  />
                  <View
                    style={{
                      width: 80,
                      height: 12,
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                }}
              />
            </View>
          ))}
        </View>
      </SkeletonPlaceholder>
    );
  };

  return (
    <Container
      title="Deleted Users"
      showBack={true}
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
              placeholder="Search deleted users..."
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

        <View style={{marginHorizontal: 20, flex: 1}}>
          {loading ? (
            renderSkeletonList()
          ) : (
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => `deleted-user-${item.id || index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{marginBottom: 60}}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[COLORS.PRIMARY]}
                  tintColor={COLORS.PRIMARY}
                />
              }
              onEndReached={onEndReached}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={renderEmptyComponent}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
              removeClippedSubviews={true}
              getItemLayout={(data, index) => ({
                length: 80, // Approximate item height
                offset: 80 * index,
                index,
              })}
            />
          )}
        </View>
      </KeyboardAvoidingView>

      <RetriveUserModal
        visible={isVisibleModal}
        onClose={onClose}
        onConfirm={onConfirm}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default RecycleBin;
