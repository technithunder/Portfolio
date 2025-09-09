import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';

import WATCH from '../../../assets/images/watch.png';
import CALENDAR from '../../../assets/images/calendar.png';
//import icons
//relative path imports
import styles from './style';
import {COLORS} from '../../config/colors';
import {getAllVisaApplications} from '../../api';
import {ApplicationSkeleton, Container, Typography} from '../../components';
import {commonSty} from '../../theme';
import {applicationStatusData, Images, Routes} from '../../config';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {navigate} from '../../utils';
import {MiniApplication} from './components';
import FastImage from 'react-native-fast-image';
import {AuthContext} from '../../context/AuthContext';

const statusBgColor = {
  approved: '#F0FDF4',
  pending: '#FFF7ED',
  rejected: '#FEF2F2',
};

const statusTextColor = {
  approved: '#059669',
  pending: '#EA580C',
  rejected: '#DC2626',
};

const statusText = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};


const Application = () => {
  const {user} = useContext(AuthContext);
  const topInset = useSafeAreaInsets().top;
  const [isSelected, setIsSelected] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState([]);
  const [bottomLoading, setBottomLoading] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [status, setStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);

  useEffect(() => {
    fetchAllVisaApplication(user?.id, page, status);
  }, [page, status]);

  console.log("==>data",data)

  const fetchAllVisaApplication = async (
    parentUserId,
    currentPage,
    currentStatus,
  ) => {
    if (currentPage === 1 && !refreshing) {
      setLoading(true);
      if (statusChanging) {
        setData([]);
        setStatusChanging(false);
      }
    } else if (currentPage > 1) {
      setBottomLoading(true);
    }

    try {
      const response = await getAllVisaApplications(
        parentUserId,
        currentPage,
        currentStatus,
      );
      const finalData =
        currentPage === 1
          ? response?.data?.data?.visaApplications
          : [...data, ...response?.data?.data?.visaApplications];

      setData(finalData);
      setAllData(response?.data?.data);
    } catch (e) {
      console.log('API error:', e);
    } finally {
      setLoading(false);
      setBottomLoading(false);
    }
  };

  const handleCategoryChange = index => {
    if (!loading) {
      setIsSelected(index);
      setData([]);
      setStatusChanging(true);
      setPage(1);
      const newStatus = index === 0 ? '' : applicationStatusData[index].key;
      setStatus(newStatus);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => handleCategoryChange(index)}
        style={[
          styles.chipView,
          {
            backgroundColor:
              isSelected === index
                ? COLORS.APP_PRIMARY_MAIN
                : COLORS.APP_GRAY_LIGHT,
          },
        ]}
        key={index}>
        <Text
          style={[
            styles.txtStatusText,
            {color: isSelected === index ? COLORS.APP_WHITE : COLORS.APP_BLACK},
          ]}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderApplicationItem = ({item, index}) => {
    return (
      <MiniApplication
        item={item}
        onPress={() => navigate(Routes.ApplicationDetail, {data: item?.id})}
      />
    );
  };

  const renderEmptyComponent = () => {
    if (!loading && !bottomLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <FastImage
            resizeMode="contain"
            source={Images.no_data}
            style={[commonSty.size(200), commonSty.selfCenter]}
          />
          <Typography
            title={'No application found'}
            align="center"
            size={20}
            color={COLORS.APP_PRIMARY_MAIN}
          />
        </View>
      );
    }
    return null;
  };

  const handleEndReach = async () => {
    if (data?.length > 0) {
      if (page + 1 <= allData?.totalPages) {
        const visaPage = page + 1;
        setPage(visaPage);
      }
    }
  };
  const renderFooterComponent = () => {
    if (bottomLoading) {
      return <ApplicationSkeleton loading={bottomLoading} />;
    }
    return null;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchAllVisaApplication(user?.id, page, status);
    setRefreshing(false);
  };

  return (
    <Container
      contentContainerStyle={commonSty.containerInset(topInset)}
      showHeader={false}
      isScroll>
      <View style={styles.header}>
        <Text style={styles.txtApplications}>Applications</Text>
      </View>
      <View style={commonSty.mt15}>
        <FlatList
          data={applicationStatusData}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      <View style={[commonSty.mt20, commonSty.flex]}>
        {loading || statusChanging ? (
          <ApplicationSkeleton loading={loading} />
        ) : (
          <FlatList
            keyExtractor={(_, index) => index.toString()}
            data={data}
            renderItem={renderApplicationItem}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.4}
            onEndReached={handleEndReach}
            ListEmptyComponent={renderEmptyComponent}
            ListFooterComponent={renderFooterComponent}
            contentContainerStyle={[commonSty.pb100]}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.APP_PRIMARY_MAIN]}
              />
            }
          />
        )}
      </View>
    </Container>
  );
};

export default Application;
