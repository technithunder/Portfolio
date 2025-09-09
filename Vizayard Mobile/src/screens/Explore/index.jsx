import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Alert,
  StyleSheet,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import styles from './style';
import {commonSty} from '../../theme';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {TrendingCountry} from '../Home/components';
import {getAllTrendingVideosApi, getTrendingNowCountry} from '../../api';
import {getFallbackThumbnail, navigate} from '../../utils';
import {COLORS} from '../../config/colors';
import {Container, Typography} from '../../components';
import HeaderWithBack from '../../components/HeaderWithBack';
import FastImage from 'react-native-fast-image';
import {create} from 'lodash';
import {s} from 'react-native-size-matters';
import {FONTS} from '../../config/font';

const Explore = ({navigation}) => {
  const topInset = useSafeAreaInsets().top;
  const [trendingNow, setTrendingNow] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  useEffect(() => {
    fetchTrendingVideos();
    fetchTrendingNowCountry();
  }, []);

  const fetchTrendingVideos = async () => {
    try {
      setIsVideoLoading(true);
      const response = await getAllTrendingVideosApi();
      if (response?.data?.status) {
        const videos = response?.data?.data || [];
        const processedVideos = videos.map(video => ({
          ...video,
          videoUrl: video.videoLink,
          thumbnail: video.thumbnail || getFallbackThumbnail(),
        }));

        setTrendingVideos(processedVideos?.slice(0,10));
      }
    } catch (e) {
      console.error('Error fetching trending videos:', e);
      setTrendingVideos([]);
    } finally {
      setIsVideoLoading(false);
    }
  };

  const fetchTrendingNowCountry = async () => {
    try {
      setIsLoading(true);
      const response = await getTrendingNowCountry();
      const country = response?.data?.data || [];
      setTrendingNow(country);
    } catch (e) {
      console.error('Error fetching trending countries:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const onPressVisa = id => {
    navigate('VisaInfo', {visaID: id, isExplore: true});
  };

  const renderTrendingNow = ({item}) => {
    return <TrendingCountry item={item} onPress={() => onPressVisa(item.id)} />;
  };

  const onPressInstagramVideo = videoUrl => {
    Linking.openURL(videoUrl).catch(err => {
      console.error('Failed to open URL:', err);
      Alert.alert('Error', 'Unable to open Instagram video');
    });
  };

  const handleImageError = item => {
    console.log(`Thumbnail failed to load for video ${item.id}`);
  };

  const renderVideoItem = ({item}) => (
    <TouchableOpacity
      style={styles.videoGridItem}
      onPress={() => onPressInstagramVideo(item.videoUrl)}
      activeOpacity={0.8}>
      <Image
        source={{uri: item.thumbnail}}
        style={styles.videoThumbnail}
        resizeMode="cover"
        onError={() => handleImageError(item)}
        defaultSource={{uri: getFallbackThumbnail()}}
      />
      <View style={styles.playOverlay}>
        <AntDesign name="play" size={32} color="#fff" />
      </View>
    </TouchableOpacity>
  );

  // Video skeletons
  const renderVideoSkeleton = ({item}) => (
    <SkeletonPlaceholder
      borderRadius={12}
      backgroundColor="#f0f0f0"
      highlightColor="#e0e0e0"
      speed={1200}>
      <View style={[styles.videoGridItem, {position: 'relative'}]}>
        <View style={styles.videoThumbnail} />
        <View
          style={[
            styles.playOverlay,
            {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: [{translateX: -16}, {translateY: -16}],
              width: 32,
              height: 32,
              borderRadius: 16,
            },
          ]}
        />
      </View>
    </SkeletonPlaceholder>
  );

  const renderVideoSkeletonList = () => (
    <FlatList
      data={Array.from({length: 6}, (_, index) => ({id: `skeleton-${index}`}))}
      keyExtractor={item => item.id}
      horizontal
      contentContainerStyle={styles.videoGrid}
      renderItem={renderVideoSkeleton}
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
    />
  );

  // // // Trending countries skeleton
  // const renderSkeletonItem = () => (
  //   <SkeletonPlaceholder
  //     borderRadius={8}
  //     backgroundColor="#f0f0f0"
  //     highlightColor="#e0e0e0">
  //     <View
  //       style={{
  //         width: 80,
  //         height: 120,
  //         marginRight: 15,
  //         borderRadius: 8,
  //       }}>
  //       <View style={{width: '100%', height: 80, borderRadius: 8}} />
  //       <View style={{width: '80%', height: 16, marginTop: 8}} />
  //     </View>
  //   </SkeletonPlaceholder>
  // );

  // const renderSkeletonList = () => (
  //   <FlatList
  //     data={Array.from({length: 4}, (_, index) => ({
  //       id: `country-skeleton-${index}`,
  //     }))}
  //     horizontal
  //     showsHorizontalScrollIndicator={false}
  //     keyExtractor={item => item.id}
  //     contentContainerStyle={commonSty.mt15}
  //     renderItem={renderSkeletonItem}
  //     scrollEnabled={false}
  //   />
  // );

  const renderTrendingCountrySkeleton = () => (
    <SkeletonPlaceholder
      borderRadius={8}
      backgroundColor="#f0f0f0"
      highlightColor="#e0e0e0">
      <View
        style={{
          borderRadius: 10,
          backgroundColor: '#fff',
          borderWidth: 1,
          marginVertical: 10,
          borderColor: '#f3f4f7ff',
          overflow: 'hidden',
        }}>
        {/* Country Image */}
        <View style={{width: '100%', height: 180, borderRadius: 10}} />

        <View style={{padding: 12}}>
          {/* Country Name */}
          <View style={{width: '70%', height: 18, borderRadius: 4}} />

          {/* Visa Type & Application Cost */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 12,
            }}>
            <View style={{width: '45%', height: 50, borderRadius: 8}} />
            <View style={{width: '45%', height: 50, borderRadius: 8}} />
          </View>

          {/* Required Documents */}
          <View style={{marginTop: 16}}>
            <View style={{width: '60%', height: 14, borderRadius: 4}} />
            <View
              style={{
                width: '80%',
                height: 14,
                borderRadius: 4,
                marginTop: 8,
              }}
            />
            <View
              style={{
                width: '70%',
                height: 14,
                borderRadius: 4,
                marginTop: 6,
              }}
            />
          </View>

          {/* Buttons */}
          <View
            style={{width: '100%', height: 44, borderRadius: 8, marginTop: 20}}
          />
          <View
            style={{width: '100%', height: 44, borderRadius: 8, marginTop: 12}}
          />
        </View>
      </View>
    </SkeletonPlaceholder>
  );

  const renderTrendingCountrySkeletonList = () => (
    <FlatList
      data={Array.from({length: 3}, (_, index) => ({
        id: `country-skeleton-${index}`,
      }))}
      keyExtractor={item => item.id}
      contentContainerStyle={{paddingHorizontal: 10, marginTop: 15}}
      renderItem={() => renderTrendingCountrySkeleton()}
      scrollEnabled={false}
    />
  );

  const renderHotDealSkeleton = () => (
    <SkeletonPlaceholder
      borderRadius={8}
      backgroundColor="#f0f0f0"
      highlightColor="#e0e0e0">
      <View
        style={{
          marginVertical: 20,
          borderRadius: 12,
          overflow: 'hidden',
        }}>
        {/* Big Image */}
        <View style={{height: 350, borderRadius: 12, width: '100%'}} />

        {/* Bottom Overlay */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
          }}>
          {/* Country Name */}
          <View
            style={{
              width: '60%',
              height: 24,
              borderRadius: 4,
              marginBottom: 15,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {/* Hot Deal Text */}
            <View style={{width: 80, height: 16, borderRadius: 4}} />

            {/* Button */}
            <View
              style={{
                height: 45,
                width: 150,
                borderRadius: 25,
              }}
            />
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.APP_WHITE}}>
      <Text style={styles.txtProfile}>Explore</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 16}}>
        {/* Top trending country card */}
        {trendingNow?.length > 0 ? (
          <View
            style={{
              marginVertical: 20,
              borderRadius: 12,
              borderColor: '#E5E7EB',
              borderWidth: 1,
              overflow: 'hidden',
            }}>
            <FastImage
              style={{height: 350, borderRadius: 12}}
              source={{
                uri:
                  trendingNow[0]?.basicDetails?.coverImage?.[0] ||
                  'https://via.placeholder.com/350',
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />

            <View style={styles.overlay} />
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 16,
              }}>
              <Typography
                title={trendingNow[0]?.basicDetails?.countryName ?? 'Unknown'}
                style={{
                  color: '#FFFFFF',
                  fontSize: 24,
                  marginBottom: 15,
                  fontFamily: FONTS.INTER_BOLD,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Typography
                  title={'Hot Deal'}
                  style={{fontSize: 14, color: '#FFFFFF'}}
                />
                <TouchableOpacity
                  onPress={() => onPressVisa(trendingNow[0]?.id)}
                  style={{
                    height: 45,
                    width: 150,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1,
                    borderRadius: 25,
                  }}>
                  <Typography
                    title={'View Details'}
                    style={{
                      color: '#111827',
                      textAlign: 'center',
                      alignItems: 'center',
                      fontFamily: FONTS.INTER_SEMIBOLD,
                      fontSize: 14,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          renderHotDealSkeleton()
        )}

        {/* Trending countries list */}
        <View style={{marginTop: 20}}>
          <View style={styles.trendingNowContainerList}>
            <Text style={styles.txtTrendingNow}>
              Trending & Popular Destination
            </Text>
            {isLoading ? (
              renderTrendingCountrySkeletonList()
            ) : (
              <FlatList
                data={trendingNow.slice(0, 10)}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={commonSty.mt15}
                renderItem={renderTrendingNow}
                nestedScrollEnabled
                keyboardDismissMode="none"
              />
            )}
          </View>
        </View>

        {/* Traveler Stories */}
        <View style={{marginTop: 20}}>
          <Text style={[styles.txtTrendingNow, {paddingHorizontal: 20}]}>
            Travelers' Stories
          </Text>
          {isVideoLoading ? (
            <View style={{paddingHorizontal: 20}}>
              {renderVideoSkeletonList()}
            </View>
          ) : trendingVideos?.length > 0 ? (
            <FlatList
              data={trendingVideos}
              keyExtractor={item => item.id.toString()}
              horizontal
              contentContainerStyle={styles.videoGrid}
              renderItem={renderVideoItem}
              showsVerticalScrollIndicator={false}
              initialNumToRender={4}
              windowSize={5}
            />
          ) : (
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 40,
                alignItems: 'center',
              }}>
              <Text style={{color: '#666', fontSize: 16}}>
                No trending videos available
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Explore;
