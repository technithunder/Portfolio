import React, {useEffect, useState, useCallback, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import debounce from 'lodash/debounce';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import styles from './style';
import {Icon, Typography} from '../../components';
import {COLORS} from '../../theme/colors';
import {FONTS} from '../../constants/fonts';
import {Images, Routes} from '../../constants';
import Carousel from './Carousel';
import {WIDTH} from '../../theme';
import {addWishList, getAllCategories, getAllProducts} from '../../api';
import Toast from 'react-native-toast-message';
import Rating from './Rating';

const data = [
  {
    icon: Images.men,
    title: 'Led lights',
  },
  {
    icon: Images.women,
    title: 'Magnetic',
  },
  {
    icon: Images.eye_wear,
    title: 'Profile lights',
  },
  {
    icon: Images.beauty,
    title: 'Focus light',
  },
  {
    icon: Images.beauty,
    title: 'Micro',
  },
];

const category_data = [
  {
    id: 0,
    title: 'All',
  },
  {
    id: 1,
    title: 'Led lights',
  },
  {
    id: 2,
    title: 'Magnetic',
  },
  {
    id: 3,
    title: 'Profile lights',
  },
  {
    id: 4,
    title: 'Focus light',
  },
  {
    id: 5,
    title: 'Micro',
  },
];

// Skeleton Components
const ProductSkeleton = () => {
  return (
    <SkeletonPlaceholder
      borderRadius={4}
      backgroundColor={COLORS.APP_LIGHT_GRAY || '#E1E9EE'}
      highlightColor={COLORS.APP_WHITE || '#F2F8FC'}>
      <View style={{width: WIDTH / 2 - 30, marginBottom: 30}}>
        <View style={{width: '100%', height: 190, borderRadius: 10}} />
        <View style={{marginTop: 10, marginLeft: 5}}>
          <View
            style={{height: 16, width: '80%', borderRadius: 4, marginBottom: 8}}
          />
          <View
            style={{height: 18, width: '60%', borderRadius: 4, marginBottom: 8}}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {[1, 2, 3, 4, 5].map(star => (
              <View
                key={star}
                style={{width: 16, height: 16, borderRadius: 8, marginRight: 2}}
              />
            ))}
            <View
              style={{width: 30, height: 12, borderRadius: 4, marginLeft: 5}}
            />
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const CategorySkeleton = () => {
  return (
    <SkeletonPlaceholder
      borderRadius={4}
      backgroundColor={COLORS.APP_LIGHT_GRAY || '#E1E9EE'}
      highlightColor={COLORS.APP_WHITE || '#F2F8FC'}>
      <View style={{alignItems: 'center'}}>
        <View style={{height: 50, width: 50, borderRadius: 25}} />
        <View style={{marginTop: 10, height: 12, width: 50, borderRadius: 4}} />
      </View>
    </SkeletonPlaceholder>
  );
};

const CarouselSkeleton = () => {
  return (
    <SkeletonPlaceholder
      borderRadius={4}
      backgroundColor={COLORS.APP_LIGHT_GRAY || '#E1E9EE'}
      highlightColor={COLORS.APP_WHITE || '#F2F8FC'}>
      <View
        style={{
          width: WIDTH - 40,
          height: 180,
          borderRadius: 12,
          marginHorizontal: 20,
        }}
      />
    </SkeletonPlaceholder>
  );
};

const NewHome = ({navigation}) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [likedItems, setLikedItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [likingProducts, setLikingProducts] = useState({});
  const [hasError, setHasError] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryChanging, setCategoryChanging] = useState(false);

  const [carouselLoaded, setCarouselLoaded] = useState(false);

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  console.log('==>127', products);

  const currentSearchRef = useRef('');
  const currentCategoryRef = useRef(0);
  const fetchingRef = useRef(false);
  const retryTimeoutRef = useRef(null);

  useEffect(() => {
    fetchAllCategories();
    setCarouselLoaded(true);

    if (isFirstLoad) {
      fetchAllProducts(true, search, selectedCategory);
      setIsFirstLoad(false);
    }
  }, []);

  const fetchAllCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await getAllCategories();
      if (response?.data?.status === 'success') {
        console.log('categories', response?.data?.data);
        const categories = response.data.data || [];
        setCategoryData([{id: 0, name: 'All'}, ...categories]);
      }
    } catch (e) {
      console.error('Error fetching categories:', e);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const updateLikedItemsFromProducts = productsList => {
    const wishlistState = {};
    productsList.forEach(product => {
      if (product.isWishlisted !== undefined) {
        wishlistState[product.id] = product.isWishlisted;
      }
    });
    setLikedItems(prev => ({...prev, ...wishlistState}));
  };

  const fetchAllProducts = async (
    reset = false,
    searchTerm = '',
    categoryId = selectedCategory,
    isFromCategoryChange = false,
  ) => {
    if (fetchingRef.current) {
      console.log('Already fetching, skipping...');
      return;
    }

    if (!reset && (loadingMore || !hasMore || hasError)) {
      return;
    }

    fetchingRef.current = true;
    setHasError(false);

    try {
      const currentPage = reset ? 1 : page;
      const searchQuery = searchTerm.trim();

      const categoryIdToPass = categoryId !== 0 ? categoryId : null;
      if (reset) {
        setRefreshing(true);
        setIsLoading(true);
        if (isFromCategoryChange) {
          setCategoryChanging(true);
        }
      } else {
        setLoadingMore(true);
      }
      const response = await getAllProducts(
        currentPage,
        searchQuery,
        categoryIdToPass,
      );

      let newProducts = [];
      let total = 0;

      if (response?.data?.data?.products) {
        newProducts = response.data.data.products;
        total = response.data.data.total || 0;
      } else if (response?.data?.products) {
        newProducts = response.data.products;
        total = response.data.total || 0;
      } else if (Array.isArray(response?.data)) {
        newProducts = response.data;
        total = response.data.length;
      } else {
        console.log('No products found in response');
        newProducts = [];
        total = 0;
      }

      console.log('Processed products:', newProducts.length, 'Total:', total);

      if (reset) {
        setProducts(newProducts);
        setPage(2);
      } else {
        setProducts(prevProducts => [...prevProducts, ...newProducts]);
        setPage(prevPage => prevPage + 1);
      }

      updateLikedItemsFromProducts(newProducts);

      const currentProductCount = reset
        ? newProducts.length
        : products.length + newProducts.length;
      const hasMoreProducts =
        currentProductCount < total && newProducts.length > 0;
      setHasMore(hasMoreProducts);

      console.log('=== API CALL END ===');
    } catch (error) {
      console.error('API Error:', error);
      setHasError(true);

      if (reset) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'Failed to load products. Please try again.',
          visibilityTime: 4000,
        });
      }

      if (reset) {
        setProducts([]);
        setHasMore(false);
      }
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
      setIsLoading(false);
      setCategoryChanging(false);
      fetchingRef.current = false;
    }
  };

  const debouncedSearch = useCallback(
    debounce((searchTerm, categoryId) => {
      if (
        currentSearchRef.current !== searchTerm ||
        currentCategoryRef.current !== categoryId
      ) {
        currentSearchRef.current = searchTerm;
        currentCategoryRef.current = categoryId;
        setPage(1);
        setProducts([]);
        setHasMore(true);
        setHasError(false);
        fetchAllProducts(
          true,
          searchTerm,
          categoryId,
          currentCategoryRef.current !== categoryId,
        );
      }
    }, 500),
    [],
  );

  // Handle search changes with error state reset
  useEffect(() => {
    // Skip the debounced search on first load since we handle it in initial useEffect
    if (!isFirstLoad) {
      debouncedSearch(search, selectedCategory);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [search, selectedCategory, debouncedSearch, isFirstLoad]);

  useFocusEffect(
    useCallback(() => {
      if (!isFirstLoad) {
        setPage(1);
        setProducts([]);
        setHasMore(true);
        setHasError(false);
        fetchAllProducts(true, search, selectedCategory);
      }
    }, [search, selectedCategory, isFirstLoad]),
  );

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      debouncedSearch.cancel();
    };
  }, []);

  const onPressLikeBtn = async productId => {
    if (likingProducts[productId]) {
      return;
    }

    try {
      const currentLikeStatus = likedItems[productId] || false;
      const newLikeStatus = !currentLikeStatus;

      setLikingProducts(prev => ({...prev, [productId]: true}));

      setLikedItems(prev => ({
        ...prev,
        [productId]: newLikeStatus,
      }));

      setProducts(prev =>
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
        Toast.show({
          type: 'success',
          text1: newLikeStatus ? 'Added to Wishlist' : 'Removed from Wishlist',
          text2: newLikeStatus
            ? 'Product has been added to your wishlist'
            : 'Product has been removed from your wishlist',
        });
      } else {
        setLikedItems(prev => ({
          ...prev,
          [productId]: currentLikeStatus,
        }));
        setProducts(prev =>
          prev.map(product =>
            product.id === productId
              ? {...product, isWishlisted: currentLikeStatus}
              : product,
          ),
        );

        Toast.show({
          type: 'error',
          text1: 'Update Failed',
          text2: 'Failed to update wishlist. Please try again.',
        });
      }
    } catch (e) {
      const currentLikeStatus = likedItems[productId] || false;
      setLikedItems(prev => ({
        ...prev,
        [productId]: currentLikeStatus,
      }));
      setProducts(prev =>
        prev.map(product =>
          product.id === productId
            ? {...product, isWishlisted: currentLikeStatus}
            : product,
        ),
      );

      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please check your connection and try again.',
      });
    } finally {
      setLikingProducts(prev => {
        const updated = {...prev};
        delete updated[productId];
        return updated;
      });
    }
  };

  const handleLoadMore = () => {
    if (
      !loadingMore &&
      hasMore &&
      !isLoading &&
      !fetchingRef.current &&
      !hasError &&
      !categoryChanging
    ) {
      console.log('Loading more products...');
      fetchAllProducts(false, search, selectedCategory);
    }
  };

  const handleRefresh = () => {
    if (!fetchingRef.current) {
      console.log('Manual refresh triggered');
      setPage(1);
      setProducts([]);
      setHasMore(true);
      setHasError(false);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      fetchAllCategories();
      fetchAllProducts(true, search, selectedCategory);
    }
  };

  const handleSearchSubmit = () => {
    debouncedSearch.cancel();
    currentSearchRef.current = search;
    currentCategoryRef.current = selectedCategory;
    setPage(1);
    setProducts([]);
    setHasMore(true);
    setHasError(false);
    fetchAllProducts(true, search, selectedCategory);
  };

  const handleSearchClear = () => {
    setSearch('');
    debouncedSearch.cancel();
    currentSearchRef.current = '';
    currentCategoryRef.current = selectedCategory;
    setPage(1);
    setProducts([]);
    setHasMore(true);
    setHasError(false);
    fetchAllProducts(true, '', selectedCategory);
  };

  const handleRetry = () => {
    setHasError(false);
    setPage(1);
    setProducts([]);
    setHasMore(true);
    fetchAllProducts(true, search, selectedCategory);
  };

  const handleCategorySelection = categoryId => {
    setSelectedCategory(categoryId);
    triggerSearch(search, categoryId, true);
  };

  const triggerSearch = useCallback(
    (searchTerm, categoryId, isFromCategoryChange = false) => {
      debouncedSearch.cancel();

      currentSearchRef.current = searchTerm;
      currentCategoryRef.current = categoryId;

      setPage(1);
      setProducts([]);
      setHasMore(true);
      setHasError(false);

      if (isFromCategoryChange) {
        setCategoryChanging(true);
      }

      fetchAllProducts(true, searchTerm, categoryId, isFromCategoryChange);
    },
    [debouncedSearch, fetchAllProducts],
  );

  const renderNewArrivals = () => {
    const onProductClick = id => {
      navigation.navigate(Routes.ProductDetail, {productId: id});
    };

    const renderItem = ({item, index}) => {
      const discount =
        ((item?.productPrice - item?.afterDiscountPrice) * 100) /
        item?.productPrice;
      return (
        <TouchableOpacity
          style={{
            width: (WIDTH - 50) / 2,
            marginHorizontal: 5,
            marginBottom: 20,
          }}
          onPress={() => onProductClick(item?.id)}>
          <View style={{position: 'relative'}}>
            <Image
              source={{uri: item?.image?.[0] || item?.image}}
              style={{width: '100%', borderRadius: 10, height: 190}}
              loadingIndicatorSource={{uri: 'placeholder-image-url'}}
            />

            <TouchableOpacity
              onPress={() => onPressLikeBtn(item.id)}
              disabled={likingProducts[item.id]}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 20,
                padding: 6,
                opacity: likingProducts[item.id] ? 0.7 : 1,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}>
              {likingProducts[item.id] ? (
                <ActivityIndicator size={20} color={COLORS.APP_PRIMARY} />
              ) : (
                <MaterialIcons
                  name={likedItems[item.id] ? 'favorite' : 'favorite-border'}
                  size={20}
                  color={likedItems[item.id] ? '#FF6B6B' : '#666'}
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={{marginTop: 10, marginLeft: 5}}>
            {item?.productName && (
              <Typography
                title={item?.productName}
                font={FONTS.INTER_REGULAR}
                size={14}
                numberOfLines={2}
              />
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginTop: 5,
              }}>
              {item?.productPrice && (
                <Typography
                  title={`₹ ${
                    item?.productPrice?.toFixed?.(2) || item?.productPrice
                  }`}
                  font={FONTS.INTER_MEDIUM}
                  size={item.afterDiscountPrice ? 14 : 16}

                  mt={2}
                  style={{
                    textDecorationLine: item?.afterDiscountPrice
                      ? 'line-through'
                      : null,
                      color:COLORS.APP_GRAY
                  }}
                />
              )}

              {item?.afterDiscountPrice && (
                <Typography
                  title={`₹ ${
                    item?.afterDiscountPrice?.toFixed?.(2) ||
                    item?.afterDiscountPrice
                  }`}
                  font={FONTS.INTER_SEMIBOLD}
                  size={16}
                  color={COLORS.APP_BLACK}
                  mt={2}
                />
              )}
            </View>

            <Typography
              title={`${discount.toFixed?.(2)}% off`}
              font={FONTS.INTER_REGULAR}
              size={12}
              numberOfLines={2}
              color={COLORS.APP_GREEN}
              mt={5}
            />
            {item?.averageRating !== 0 && (
              <Rating rating={item?.averageRating} />
            )}
          </View>
        </TouchableOpacity>
      );
    };

    const renderSkeletonItems = () => {
      return Array.from({length: 6}, (_, index) => (
        <ProductSkeleton key={`skeleton-${index}`} />
      ));
    };

    const renderListHeader = () => (
      <View>
        {renderCarousel()}
        {renderCategory()}
        <View style={{marginTop: 20, marginBottom: 20}}>
          <Typography
            title={'New Arrivals'}
            font={FONTS.INTER_MEDIUM}
            size={18}
          />
        </View>
      </View>
    );

    const renderListFooter = () => {
      if (loadingMore) {
        return (
          <View style={{marginVertical: 10}}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
              }}>
              {Array.from({length: 4}, (_, index) => (
                <ProductSkeleton key={`loadmore-skeleton-${index}`} />
              ))}
            </View>
          </View>
        );
      }
      return <View style={{height: 80}} />;
    };

    const renderEmptyList = () => {
      if (isLoading || categoryChanging) {
        return (
          <View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                marginTop: 20,
              }}>
              {renderSkeletonItems()}
            </View>
          </View>
        );
      }

      // Show error state with retry button
      if (hasError) {
        return (
          <View>
            <View style={{alignItems: 'center', marginTop: 50}}>
              <MaterialIcons
                name="error-outline"
                size={60}
                color={COLORS.APP_GRAY}
              />
              <Typography
                title="No Data Found"
                font={FONTS.INTER_MEDIUM}
                size={14}
                color={COLORS.APP_GRAY}
              />

              <TouchableOpacity
                onPress={handleRetry}
                style={{
                  marginTop: 10,
                  backgroundColor: COLORS.APP_PRIMARY,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 6,
                }}>
                <Typography
                  title="Retry"
                  font={FONTS.INTER_MEDIUM}
                  size={14}
                  color={COLORS.APP_WHITE}
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      }

      return (
        <View>
          <View style={{alignItems: 'center', marginTop: 50}}>
            <MaterialIcons
              name="search-off"
              size={60}
              color={COLORS.APP_LIGHT_GRAY}
            />
            <Typography
              title={
                search ? `No results for "${search}"` : 'No products found'
              }
              font={FONTS.INTER_MEDIUM}
              size={16}
              color={COLORS.APP_GRAY}
              style={{marginTop: 16}}
            />
            <Typography
              title="Try adjusting your search criteria"
              font={FONTS.INTER_REGULAR}
              size={14}
              color={COLORS.APP_LIGHTER_GRAY}
              style={{marginTop: 8}}
            />
          </View>
        </View>
      );
    };

    return (
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item, index) => `product-${item?.id || index}`}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
        renderItem={renderItem}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        ListEmptyComponent={renderEmptyList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.APP_PRIMARY]}
            tintColor={COLORS.APP_PRIMARY}
            title="Pull to refresh"
            titleColor={COLORS.APP_GRAY}
          />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
      />
    );
  };

  const renderCategory = () => {
    const renderSkeletonCategories = () => {
      return Array.from({length: 5}, (_, index) => (
        <View key={`category-skeleton-${index}`} style={{marginRight: 10}}>
          <SkeletonPlaceholder
            borderRadius={25}
            backgroundColor={COLORS.APP_LIGHT_GRAY || '#E1E9EE'}
            highlightColor={COLORS.APP_WHITE || '#F2F8FC'}>
            <View
              style={{
                height: 36,
                width: 80,
                borderRadius: 25,
              }}
            />
          </SkeletonPlaceholder>
        </View>
      ));
    };

    const renderCategories = ({item, index}) => {
      return (
        <TouchableOpacity
          onPress={() => handleCategorySelection(item?.id)}
          disabled={categoryChanging}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 12,
            flex: 1,
            backgroundColor:
              selectedCategory === item?.id
                ? COLORS.APP_PRIMARY
                : COLORS.APP_LIGHT_GRAY,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
            opacity: categoryChanging ? 0.7 : 1,
          }}>
          <Typography
            title={item?.name}
            font={FONTS.INTER_MEDIUM}
            size={14}
            color={
              selectedCategory === item?.id ? COLORS.APP_WHITE : COLORS.APP_GRAY
            }
            numberOfLines={2}
            textAlign="center"
          />
        </TouchableOpacity>
      );
    };

    return (
      <View style={{marginTop: 20, marginBottom: 10}}>
        <Typography title={'Category'} font={FONTS.INTER_MEDIUM} size={18} />
        {categoriesLoading ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 14,
            }}>
            {renderSkeletonCategories()}
          </View>
        ) : (
          <FlatList
            data={categoryData}
            renderItem={renderCategories}
            horizontal={true}
            keyExtractor={(item, index) => `category-${index}`}
            showsHorizontalScrollIndicator={false}
            style={{marginTop: 14}}
          />
        )}
      </View>
    );
  };

  const renderCarousel = () => {
    return (
      <View style={{marginTop: 10}}>
        {!carouselLoaded ? <CarouselSkeleton /> : <Carousel />}
      </View>
    );
  };

  const renderSearchBar = () => {
    return (
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Icon
            icon="AntDesign"
            name="search1"
            size={16}
            color={COLORS.APP_LIGHTER_GRAY}
          />
          <TextInput
            placeholder="Search products..."
            placeholderTextColor={COLORS.APP_LIGHTER_GRAY}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            onSubmitEditing={handleSearchSubmit}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={handleSearchClear}>
              <MaterialIcons
                name="clear"
                size={20}
                color={COLORS.APP_LIGHTER_GRAY}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Image source={Images.logo} style={{height: 22, width: 22}} />
          <Typography
            title={'Virtual Lights'}
            size={20}
            font={FONTS.INTER_MEDIUM}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate(Routes.Notify)}>
          <View style={{position: 'relative'}}>
            <Image source={Images.bell} style={{height: 24, width: 24}} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      {renderSearchBar()}
      {renderNewArrivals()}
    </SafeAreaView>
  );
};

export default NewHome;
