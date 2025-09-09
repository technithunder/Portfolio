import React, {useEffect, useMemo, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import styles from './style';
import {COLORS} from '../../config/colors';
import {getAllVisas, getTrendingNowCountry} from '../../api';
import {
  Button,
  Container,
  Icon,
  TrendingSkeleton,
  Typography,
  VisaCardSkeleton,
  VisaHeaderSkeleton,
} from '../../components';
import FastImage from 'react-native-fast-image';
import {Images} from '../../config';
import {commonSty} from '../../theme';
import {Country, TrendingCountry} from './components';
import {navigate} from '../../utils';
import {CountryProps, mainDataType} from './types';
import {FONTS} from '../../config/font';
import {useIsFocused} from '@react-navigation/native';
import HomeCarousel from './components/Carousel';
import VIZAYARD_LOGO from '../../../assets/images/app_logo2.png';

const Home = () => {
  const isFocus = useIsFocused();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [trendingNow, setTrendingNow] = useState([]);
  const [page, setPage] = useState(1);
  const [bottomLoading, setBottomLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const [mainData, setMainData] = useState<mainDataType>({
    totalPages: 0,
    totalVisas: 0,
    pages: 0,
    data: [],
  });

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      await Promise.all([fetchAllVisas(false), fetchTrendingNowCountry(false)]);
      setInitialLoading(false);
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearchActive(search?.length > 0);

    // Show loading immediately when user starts typing or clearing
    if (!initialLoading) {
      setSearching(true);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, initialLoading]);

  useEffect(() => {
    if (!initialLoading) {
      const searchData = async () => {
        // Always set searching to true when debouncedSearch changes
        setSearching(true);

        try {
          await fetchAllVisas(false);
        } finally {
          setSearching(false);
        }
      };

      searchData();
    }
  }, [debouncedSearch, initialLoading]);

  useEffect(() => {
    if (isFocus) {
      setSearch('');
      setDebouncedSearch('');
      setIsSearchActive(false);
      setSearching(false);
    }
  }, [isFocus]);

  useEffect(() => {
    const backAction = () => {
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const fetchTrendingNowCountry = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);

    try {
      const response: any = await getTrendingNowCountry();
      const country: any = response?.data?.data || [];
      setTrendingNow(country);
    } catch (e) {
      console.error('Error fetching trending countries:', e);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const fetchAllVisas = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);

    try {
      const response: any = await getAllVisas(debouncedSearch, 1);
      const visaData = response?.data?.data ? response?.data?.data?.visas : [];
      setData(visaData);
      setMainData(response?.data?.data);
      setPage(1);
    } catch (e) {
      console.error('Error fetching visas:', e);
    } finally {
      setRefreshing(false);
      if (showLoading) setIsLoading(false);
      setBottomLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchAllVisas(false), fetchTrendingNowCountry(false)]).finally(
      () => {
        setRefreshing(false);
      },
    );
  }, [debouncedSearch]);

  const handleEndReach = async () => {
    if (
      data?.length > 0 &&
      page + 1 <= mainData?.totalPages &&
      !bottomLoading
    ) {
      setBottomLoading(true);
      const visaPage = page + 1;
      try {
        const response: any = await getAllVisas(debouncedSearch, visaPage);
        const visaData = response?.data?.data?.visas || [];
        setData(currentData => [...currentData, ...visaData]);
        setMainData(response?.data?.data);
        setPage(visaPage);
      } catch (e) {
        console.error('Error fetching more visas:', e);
      } finally {
        setBottomLoading(false);
      }
    }
  };

  // Updated clear search function to show loading
  const clearSearch = () => {
    setSearch('');
    // Don't immediately clear debouncedSearch and searching state
    // Let the useEffect handle it with debouncing and loading
  };

  const renderEmptyComponent = () => {
    // Don't show empty component while searching
    if (searching) {
      return null;
    }

    return (
      <View style={[commonSty.mt25, commonSty.alignCenter]}>
        <FastImage
          resizeMode="contain"
          source={Images.no_data}
          style={[commonSty.size(200), commonSty.selfCenter]}
        />
        <Typography
          title={'No search results found'}
          align="center"
          size={20}
          color={COLORS.APP_PRIMARY_MAIN}
        />
      </View>
    );
  };

  const renderCountryCard = ({item}: {item: CountryProps['item']}) => {
    return <Country item={item} />;
  };

  const renderFooterComponent = () => {
    if (bottomLoading) {
      return <VisaCardSkeleton loading={bottomLoading} />;
    }
    return null;
  };

  const showSkeleton = initialLoading;

  const renderHeaderComponent = useMemo(() => {
    if (showSkeleton) {
      return null;
    }

    return (
      <View>
        <View style={styles.headerContainerStyle}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 20,
              marginTop: 20,
              width: '90%',
            }}>
            <View style={{width: 45, marginRight: 10}}>
              <Image
                source={VIZAYARD_LOGO}
                style={{
                  height: 48,
                  width: 48,
                  borderRadius: 12,
                  resizeMode: 'contain',
                }}
              />
            </View>
            <View style={styles.destinationInputView}>
              <View style={styles.destinationInput}>
                <Feather
                  name="search"
                  color={COLORS.APP_COMMON_GRAY}
                  size={20}
                />
                <TextInput
                  placeholder="Search destinations"
                  placeholderTextColor={COLORS.APP_PLACEHOLDER}
                  style={styles.input}
                  onChangeText={setSearch}
                  value={search}
                />

                {search.length > 0 && !searching && (
                  <TouchableOpacity
                    onPress={clearSearch}
                    style={styles.closeButton}
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                    <Feather
                      name="x"
                      color={COLORS.APP_COMMON_GRAY}
                      size={18}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <View>{!search && <HomeCarousel />}</View>
        </View>

        <Typography
          title={
            search?.length > 0 ? 'Search Destinations' : 'Popular Destinations'
          }
          mb={15}
          mt={10}
          font={FONTS.INTER_SEMIBOLD}
        />
      </View>
    );
  }, [search, trendingNow, showSkeleton, isSearchActive, searching]);

  // Show search loading content with skeleton
  const renderSearchLoading = () => {
    return (
      <View>
        <VisaCardSkeleton loading={true} />
      </View>
    );
  };

  const mainContent = (
    <FlatList
      data={searching ? [] : data} // Show empty data while searching
      keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
      numColumns={2}
      renderItem={renderCountryCard}
      columnWrapperStyle={styles.row}
      ListHeaderComponent={renderHeaderComponent}
      ListEmptyComponent={
        searching ? renderSearchLoading : renderEmptyComponent
      }
      contentContainerStyle={[commonSty.ph20, commonSty.pb100, {flexGrow: 1}]}
      ListFooterComponent={renderFooterComponent}
      onEndReachedThreshold={0.4}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      onEndReached={handleEndReach}
      nestedScrollEnabled
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.APP_PRIMARY_MAIN]}
          tintColor={COLORS.APP_PRIMARY_MAIN}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );

  return (
    <Container showHeader={false}>
      {showSkeleton ? (
        <>
          <VisaHeaderSkeleton loading={true} />
          {/* <TrendingSkeleton loading={true} /> */}
          <VisaCardSkeleton loading={true} />
        </>
      ) : (
        mainContent
      )}
    </Container>
  );
};

export default Home;
