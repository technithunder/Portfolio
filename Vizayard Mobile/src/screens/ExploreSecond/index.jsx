import React, {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';

import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import styles from './style';
import {COLORS} from '../../config/colors';
import FILTER from '../../../assets/images/explore/filter.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {getAllVisas} from '../../api';

const ExploreSecond = ({navigation}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = [
    {
      id: '1',
      label: 'All',
      icon: <AntDesign name="earth" size={14} color={COLORS.APP_PRIMARY} />,
    },
    {
      id: '2',
      label: 'Instant',
      icon: (
        <SimpleLineIcons name="energy" size={14} color={COLORS.APP_PRIMARY} />
      ),
    },
    {
      id: '3',
      label: 'In a week',
      icon: <EvilIcons name="calendar" size={14} color={COLORS.APP_PRIMARY} />,
    },
    {
      id: '4',
      label: 'In a month',
      icon: <EvilIcons name="calendar" size={14} color={COLORS.APP_PRIMARY} />,
    },
  ];

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestPermissionAndroid();
    } else {
      requestPermissionIos();
    }
  }, []);

  const requestPermissionAndroid = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      getFCMToken();
    }
  };

  const requestPermissionIos = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFCMToken();
    }
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onDisplayNotification(remoteMessage);
      console.log('Foreground Notification Received: ', remoteMessage);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    //handle background notification clicks
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage?.data?.screen) {
        navigation.navigate(remoteMessage?.data?.screen);
      }
    });

    //handle closed app notification clicks
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data?.screen) {
          navigation.navigate(remoteMessage?.data?.screen);
        }
      });
  }, []);

  const getFCMToken = async () => {
    const token = await messaging().getToken();
  };

  useEffect(() => {
    setPage(1);
    setData([]);
    setHasMore(true);
    const delayDebounceFn = setTimeout(() => {
      fetchAllVisas(search, 1);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const fetchAllVisas = async (query = '', currentPage = 1) => {
    if (currentPage === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const response = await getAllVisas(query, currentPage, limit);
      const newVisas = response?.data?.data?.visas || [];

      if (currentPage === 1) {
        setData(newVisas);
      } else {
        setData(prevData => [...prevData, ...newVisas]);
      }

      if (newVisas.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error('Error fetching visas:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const onPressVisa = id => {
    navigation.navigate('VisaInfo', {visaID: id});
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchAllVisas(search, nextPage);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{paddingVertical: 20}}>
        <ActivityIndicator size={28} color={COLORS.APP_PRIMARY} />
      </View>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    try {
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => onPressVisa(item.id)}
      style={[styles.animatedCard, {overflow: 'hidden', marginBottom: 16}]}>
      <View style={{height: '80%', width: '100%'}}>
        <ImageBackground
          source={{uri: item?.basicDetails?.coverImage}}
          style={{height: '100%', width: '100%'}}>
          <View style={styles.cardChip}>
            <Text style={styles.txtCardChip}>
              {item?.basicDetails?.totalVisaCompleted}K+ Visas on Time
            </Text>
          </View>
        </ImageBackground>
      </View>
      <View
        style={{
          height: '20%',
          paddingHorizontal: 26,
          paddingVertical: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text style={styles.txtTitle}>{item?.basicDetails?.countryName}</Text>
          {/* <Text style={styles.txtDesc}>{item.date}</Text> */}
        </View>
        <View>
          <Text style={styles.txtPrice}>
            ₹
            {parseInt(item?.visaDetails?.govtVisaFee) +
              parseInt(item?.visaDetails?.visaFee) +
              parseInt(item?.visaDetails?.vizayardFee)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={COLORS.APP_WHITE}
        barStyle={'dark-content'}
      />
      <View style={styles.headerWrapper}>
        <View style={styles.styledDestinationInput}>
          <View style={{width: '10%'}}>
            <Ionicons name="search" size={22} color={COLORS.APP_BLACK} />
          </View>
          <View style={{width: '80%'}}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Destination"
              placeholderTextColor={COLORS.APP_GRAY}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <View style={{width: '20%'}}>
            <TouchableOpacity style={styles.filterBtn}>
              <Image
                source={FILTER}
                style={{height: 22, width: 22, tintColor: COLORS.APP_BLACK}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{marginTop: 20}}>
        <FlatList
          data={tabs}
          horizontal
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 20, gap: 10}}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => setSelectedTab(index)}
              style={[
                styles.tab,
                {
                  backgroundColor:
                    selectedTab === index
                      ? COLORS.APP_PRIMARY
                      : COLORS.APP_WHITE,
                },
              ]}>
              <Text
                style={[
                  styles.txtTab,
                  {
                    color:
                      selectedTab === index
                        ? COLORS.APP_WHITE
                        : COLORS.APP_GRAY,
                  },
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading && page === 1 ? (
        <ActivityIndicator
          size={28}
          color={COLORS.APP_PRIMARY}
          style={{flex: 1}}
        />
      ) : (
        <>
          {!loading && data?.length === 0 ? (
            <View style={{alignItems: 'center', marginTop: 20}}>
              <Text style={styles.txtNoDataFound}>No data found</Text>
            </View>
          ) : (
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              style={{marginTop: 24, marginHorizontal: 20}}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default ExploreSecond;
