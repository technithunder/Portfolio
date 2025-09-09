import React, {useEffect, useState, useCallback} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from './style';
import {Container, Icon} from '../../components';
import {Images, Routes} from '../../constants';
import {COLORS} from '../../theme/colors';
import {navigate} from '../../utils';
import {deleteAddress, getAllAddress} from '../../api';

const Address = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchAllAddress(1, true);
  }, []);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (search.length >= 0) {
        fetchAllAddress(1, true, search);
      }
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [search]);

  const fetchAllAddress = async (
    page = 1,
    isRefresh = false,
    searchQuery = '',
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setCurrentPage(1);
        setHasMoreData(true);
      } else if (page > 1) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await getAllAddress(page, searchQuery);

      if (response?.data?.status === 'success') {
        console.log('Fetched addresses:', response.data.data);
        const newAddresses = response.data.data?.users || [];

        if (isRefresh || page === 1) {
          setAddresses(newAddresses);
        } else {
          setAddresses(prevAddresses => [...prevAddresses, ...newAddresses]);
        }

        if (newAddresses.length < 10) {
          setHasMoreData(false);
        } else {
          setHasMoreData(true);
        }

        if (!isRefresh && page > 1) {
          setCurrentPage(page);
        } else {
          setCurrentPage(1);
        }
      } else {
        if (isRefresh || page === 1) {
          setAddresses([]);
        }
        setHasMoreData(false);
      }
    } catch (error) {
      console.log('Error fetching addresses:', error);
      if (isRefresh || page === 1) {
        setAddresses([]);
      }
      setHasMoreData(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = useCallback(() => {
    fetchAllAddress(1, true, search);
  }, [search]);

  const loadMoreData = () => {
    if (!loadingMore && hasMoreData && addresses.length > 0) {
      const nextPage = currentPage + 1;
      fetchAllAddress(nextPage, false, search);
    }
  };

  const handleDeleteAddress = async addressId => {
    try {
      setDeleteLoading(true);
      const response = await deleteAddress(addressId);
      if (response?.data?.status === 'success') {
        fetchAllAddress(1, true, search);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const clearSearch = () => {
    setSearch('');
  };

  const renderAddressList = ({item}) => {
    return (
      <TouchableOpacity style={styles.addressCard}>
        <View style={styles.addressContent}>
          <View style={styles.addressIcon}>
            <Icon
              icon="AntDesign"
              name="enviromento"
              size={20}
              color={COLORS.APP_PRIMARY}
            />
          </View>

          <View style={styles.addressDetails}>
            <Text style={styles.streetText}>
              {item.street || item.address_line_1 || item.full_address || 'N/A'}
            </Text>
            <Text style={styles.locationText}>
              {item.city || 'N/A'}, {item.state || 'N/A'} -{' '}
              {item.zipCode || item.postal_code || 'N/A'}
            </Text>
            <Text style={styles.countryText}>{item.country || 'N/A'}</Text>
          </View>

          <View style={styles.actionButtons}>
            <View style={styles.editButton}>
              <Icon
                icon="AntDesign"
                name="edit"
                size={16}
                onPress={() =>
                  navigate(Routes.AddAddress, {addressId: item.id})
                }
                color={COLORS.APP_LIGHTER_GRAY}
              />
            </View>
            <View style={[styles.editButton, {marginTop: 10}]}>
              <Icon
                icon="AntDesign"
                name="delete"
                size={16}
                onPress={() => handleDeleteAddress(item.id)}
                color={COLORS.APP_ERROR || '#FF4444'}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Footer component for loading indicator
  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.APP_PRIMARY} />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  // Empty component
  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.APP_PRIMARY} />
          <Text style={styles.emptyText}>Loading addresses...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Icon
          icon="AntDesign"
          name="enviromento"
          size={50}
          color={COLORS.APP_LIGHTER_GRAY}
        />
        <Text style={styles.emptyText}>
          {search ? 'No addresses found for your search' : 'No addresses found'}
        </Text>
      </View>
    );
  };

  return (
    <Container
      title="Address"
      leftIcon={Images.back}
      onLeftPress={() => navigate(Routes.BottomStack, {screen: Routes.Profile})}
      style={[styles.container]}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Search Input */}
        <View style={styles.inputView}>
          <View style={{width: '10%'}}>
            <Icon
              icon="AntDesign"
              name="search1"
              size={16}
              color={COLORS.APP_LIGHTER_GRAY}
            />
          </View>
          <View style={{width: search ? '80%' : '90%'}}>
            <TextInput
              placeholder="Search address"
              onChangeText={setSearch}
              value={search}
              style={styles.searchInput}
              placeholderTextColor={COLORS.APP_LIGHTER_GRAY}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {search ? (
            <View style={{width: '10%', alignItems: 'center'}}>
              <Icon
                icon="AntDesign"
                name="close"
                size={16}
                color={COLORS.APP_LIGHTER_GRAY}
                onPress={clearSearch}
              />
            </View>
          ) : null}
        </View>

        {/* Address List */}
        <View style={{marginTop: 20, flex: 1}}>
          <FlatList
            data={addresses}
            renderItem={renderAddressList}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContainer,
              addresses.length === 0 && styles.emptyListContainer,
            ]}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.APP_PRIMARY]}
                tintColor={COLORS.APP_PRIMARY}
              />
            }
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={10}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigate(Routes.AddAddress)}>
        <AntDesign name="plus" size={22} color={COLORS.APP_WHITE} />
      </TouchableOpacity>
    </Container>
  );
};

export default Address;
