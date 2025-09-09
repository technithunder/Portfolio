import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import {Images, Routes} from '../../constants';
import {Typography} from '../../components';
import {FONTS} from '../../constants/fonts';
import {getAllWishlist, addWishList} from '../../api';
import {WIDTH} from '../../theme';
import {COLORS} from '../../theme/colors';

const MyWishList = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likedItems, setLikedItems] = useState({});

  useEffect(() => {
    fetchAllWishList(1, true);
  }, []);

  // Initialize liked items state based on wishlist data
  useEffect(() => {
    if (data.length > 0) {
      const initialLikedState = {};
      data.forEach(item => {
        initialLikedState[item.id] = item.isWishlisted;
      });
      setLikedItems(initialLikedState);
    }
  }, [data]);

  const fetchAllWishList = async (page = 1, isInitial = false) => {
    if (isInitial) {
      setIsLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await getAllWishlist(page);

      if (response?.data?.status === 'success') {
        const newData = response.data.data.data;
        const pagination = {
          total: response.data.data.total,
          page: response.data.data.page,
          pageSize: response.data.data.pageSize,
          totalPages: response.data.data.totalPages,
        };

        if (isInitial || page === 1) {
          // First load or refresh
          setData(newData);
        } else {
          // Pagination - append new data
          setData(prevData => [...prevData, ...newData]);
        }

        setCurrentPage(pagination.page);
        setTotalPages(pagination.totalPages);
        setHasMore(pagination.page < pagination.totalPages);
      }
    } catch (e) {
      console.log('Error fetching wishlist:', e);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    setHasMore(true);
    fetchAllWishList(1, true);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore && currentPage < totalPages) {
      const nextPage = currentPage + 1;
      fetchAllWishList(nextPage, false);
    }
  };

  const onPressLikeBtn = async productId => {
    try {
      const currentLikeStatus = likedItems[productId] || false;
      const newLikeStatus = !currentLikeStatus;

      // Optimistically update UI
      setLikedItems(prev => ({
        ...prev,
        [productId]: newLikeStatus,
      }));

      // Update the product's isWishlisted status in the data array
      setData(prev =>
        prev.map(product =>
          product.id === productId
            ? {...product, isWishlisted: newLikeStatus}
            : product,
        ),
      );

      const obj = {
        productId: productId,
      };

      const response = await addWishList(obj);

      if (response?.data?.status === 'success') {
        console.log('Wishlist updated successfully');

        // If item was removed from wishlist, remove it from the list
        if (!newLikeStatus) {
          setData(prev => prev.filter(product => product.id !== productId));
          // Remove from likedItems state as well
          setLikedItems(prev => {
            const newState = {...prev};
            delete newState[productId];
            return newState;
          });
        }
      } else {
        // Revert on API failure
        setLikedItems(prev => ({
          ...prev,
          [productId]: currentLikeStatus,
        }));
        setData(prev =>
          prev.map(product =>
            product.id === productId
              ? {...product, isWishlisted: currentLikeStatus}
              : product,
          ),
        );
        console.log('Error updating wishlist:', response?.data?.message);
      }
    } catch (e) {
      // Revert on API error
      const currentLikeStatus = likedItems[productId] || false;
      setLikedItems(prev => ({
        ...prev,
        [productId]: currentLikeStatus,
      }));
      setData(prev =>
        prev.map(product =>
          product.id === productId
            ? {...product, isWishlisted: currentLikeStatus}
            : product,
        ),
      );
      console.log('API Error:', e);
    }
  };

  const onProductClick = id => {
    navigation.navigate(Routes.ProductDetail, {productId: id});
  };

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      style={{
        width: (WIDTH - 50) / 2,
        marginHorizontal: 5, // Small horizontal margin
        marginBottom: 20,
      }}
      onPress={() => onProductClick(item?.id)}>
      <View style={{position: 'relative'}}>
        <Image
          source={{uri: item?.image[0]}}
          style={{width: '100%', borderRadius: 10, height: 190}}
        />

        <TouchableOpacity
          onPress={() => onPressLikeBtn(item.id)}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 20,
            padding: 6,
          }}>
          <MaterialIcons
            name={likedItems[item.id] ? 'favorite' : 'favorite-border'}
            size={20}
            color={likedItems[item.id] ? 'red' : 'black'}
          />
        </TouchableOpacity>
      </View>

      <View style={{marginTop: 10, marginLeft: 5}}>
        {item?.productName && (
          <Typography
            title={item?.productName}
            font={FONTS.INTER_REGULAR}
            size={14}
          />
        )}
        {item?.productPrice && (
          <Typography
            title={`₹ ${item?.productPrice?.toFixed(2)}`}
            font={FONTS.INTER_SEMIBOLD}
            size={16}
          />
        )}
        <View
          style={{flexDirection: 'row', marginTop: 4, alignItems: 'center'}}>
          {[1, 2, 3, 4, 5].map(star => (
            <MaterialIcons
              key={star}
              name="star"
              size={16}
              color="#508A7B"
              style={{marginRight: 2}}
            />
          ))}
          <Typography title={'(4.5)'} font={FONTS.INTER_REGULAR} size={12} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
      }}>
      <MaterialIcons name="favorite-border" size={50} color="#ccc" />
      <Typography
        title="No items in wishlist"
        font={FONTS.INTER_REGULAR}
        size={16}
        style={{marginTop: 10, color: '#999'}}
      />
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={{marginVertical: 20, alignItems: 'center'}}>
        <ActivityIndicator size="small" color={COLORS.APP_PRIMARY} />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={Images.back} style={{height: 20, width: 20}} />
        </TouchableOpacity>
        <Typography title={'WishList'} size={20} font={FONTS.INTER_MEDIUM} />
        <View />
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {renderHeader()}
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={COLORS.APP_PRIMARY} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        columnWrapperStyle={{
          ustifyContent: 'space-between', // Even spacing between columns
          marginBottom: 10,
        }}
        contentContainerStyle={{
          paddingVertical: 10,
          paddingBottom: 80,
          flexGrow: 1,
        }}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[COLORS.APP_PRIMARY]}
            tintColor={COLORS.APP_PRIMARY}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default MyWishList;
