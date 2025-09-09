import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
  Modal,
  Dimensions,
} from 'react-native';

import WATCH from '../../../assets/images/watch.png';
import CALENDAR from '../../../assets/images/calendar.png';
//import icons
//relative path imports
import styles from './style';
import {COLORS} from '../../config/colors';
import {getAllVisaApplications} from '../../api';
import {
  ApplicationSkeleton,
  Container,
  Icon,
  Typography,
} from '../../components';
import {commonSty} from '../../theme';
import {applicationStatusData, Images, Routes} from '../../config';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {navigate, replace} from '../../utils';
import {MiniApplication} from './components';
import FastImage from 'react-native-fast-image';
import {AuthContext} from '../../context/AuthContext';
import HeaderWithBack from '../../components/HeaderWithBack';
import {FONTS} from '../../config/font';

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

const Application = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const topInset = useSafeAreaInsets().top;
  const [isSelected, setIsSelected] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState([]);
  const [bottomLoading, setBottomLoading] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [status, setStatus] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
   const [selectedFilter, setSelectedFilter] = useState({ key: '', title: 'All', label: 'All' });
  const popoverRef = useRef(null);

  const menu = require('../../../assets/images/menu.png');

  // Add "All" option to applicationStatusData
  const filterOptions = [
     { key: '', title: 'All', label: 'All' },
    ...applicationStatusData,
  ];

  useEffect(() => {
    fetchAllVisaApplication(user?.id, page, status);
  }, [page, status]);

  console.log('==>data', data);

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

  const handleFilterSelect = filterOption => {
    setSelectedFilter(filterOption);
    setData([]);
    setStatusChanging(true);
    setPage(1);
    setStatus(filterOption.key);
    setShowPopover(false);
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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',height:'100%'}}>
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

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  const renderPopoverItem = ({item}) => {
    const isSelected = selectedFilter?.key === item.key;
    return (
      <TouchableOpacity
        style={[styles.popoverItem, isSelected && styles.selectedPopoverItem]}
        onPress={() => handleFilterSelect(item)}>
        <Typography
          title={item.title}
          size={12}
          color={isSelected ? COLORS.APP_WHITE : COLORS.APP_BLACK}
        />
        {isSelected && (
          <Icon
            name="check"
            size={16}
            color={COLORS.APP_WHITE}
            style={{marginLeft: 8}}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Container
      contentContainerStyle={commonSty.containerInset(topInset)}
      showHeader={false}
      isScroll>
      <View style={styles.headerContainer}>
        <HeaderWithBack
          title={'Applications'}
          onBack={() => navigation.navigate("Bottom",{screen:"Profile"})}
          rightIcon={menu}
          onRightPress={togglePopover}
        />
        {showPopover && (
          <View style={styles.popoverContainer}>
            <View style={styles.popover}>
              <View style={styles.popoverArrow} />
              <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <Typography
                title="Filter by Status"
                size={14}
                font={FONTS.INTER_BOLD}
                
                color={COLORS.APP_BLACK}
              />
              <Icon icon='AntDesign' name="close" size={18}  onPress={() => setShowPopover(false)}/>
              </View>
              <FlatList
                data={filterOptions}
                renderItem={renderPopoverItem}
                keyExtractor={item => item.key}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        )}

        {/* Overlay to close popover */}
        {showPopover && (
          <TouchableOpacity
            style={styles.popoverOverlay}
            activeOpacity={1}
            onPress={() => setShowPopover(false)}
          />
        )}
      </View>

      <View style={[commonSty.flex]}>
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
            contentContainerStyle={[commonSty.pb100,{flexGrow:1}]}
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
