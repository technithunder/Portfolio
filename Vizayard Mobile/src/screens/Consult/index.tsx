import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  BackHandler,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useFocusEffect } from '@react-navigation/native';
import styles from './style';
import {
  Button,
  Container,
  CustomConfirmModal,
  Typography,
} from '../../components';
import {commonSty} from '../../theme';
import {navigate} from '../../utils';
import {COLORS} from '../../config/colors';
import {Images, Routes} from '../../config';
import {deleteScheduledCall, getAllScheduledCall} from '../../api';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import {FONTS} from '../../config/font';
import {moderateScale} from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';
import { AuthContext } from '../../context/AuthContext';
import AnimatedHeader from '../../components/AnimatedHeader';

const Consult = () => {
  const {user} = useContext(AuthContext)
  const [data, setData] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [loader, setLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllScheduleCall();
  }, []);

 const fetchAllScheduleCall = async () => {
    setIsLoading(true);
    try {
      const response = await getAllScheduledCall(user?.id);
      if (response?.data?.status) {
        setData(response?.data?.data);
      }
    } catch (e) {
      console.log('Error in fetching schedule call', e);
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch scheduled calls',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAllScheduleCall();
    } finally {
      setRefreshing(false);
    }
  };

  const handleNavigate = () => navigate(Routes.ScheduleEvent);

  const onPressDelete = async id => {
    setSelectedScheduleId(id);
    setOpenDeleteModal(true);
  };

  const onClickConfirmButton = async () => {
    setLoader(true);
    try {
      const response = await deleteScheduledCall(selectedScheduleId);
      if (response?.data?.status) {
        Toast.show({
          type: 'success',
          text1: response?.data?.message,
        });
        fetchAllScheduleCall();
        onClickCancelButton();
      }
    } catch (e) {
      console.log('Error in deleting schedule call', e);
      Toast.show({
        type: 'error',
        text1: 'Failed to delete scheduled call',
      });
      onClickCancelButton()
    } finally {
      onClickCancelButton()
      // setLoader(false);
    }
  };

  const onClickCancelButton = () => {
    setSelectedScheduleId(null);
    setOpenDeleteModal(false);
    setLoader(false);
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.miniConsultContainer}>
        <View style={styles.miniConsultSubContainer} />
        <View style={styles.wid90}>
          <Typography
            title={moment(item?.date).format('DD MMM, YYYY')}
            size={14}
          />
          <Typography
            title={'Call for consulting related to visa'}
            size={12}
            color={COLORS.APP_COMMON_PLACEHOLDER}
            mt={4}
          />
        </View>
        <View style={{flexDirection: 'row', gap: 10}}>
          <TouchableOpacity
            onPress={() => navigate(Routes.ScheduleEvent, {data: item})}>
            <AntDesign name="edit" size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPressDelete(item?.id)}>
            <MaterialCommunityIcons
              name="delete"
              size={20}
              color={COLORS.APP_RED}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSkeleton = () => {
    return (
      <SkeletonPlaceholder borderRadius={8}>
        {[1, 2, 3].map(index => (
          <View key={index} style={styles.miniConsultContainer}>
            <View style={styles.miniConsultSubContainer} />
            <View style={styles.wid90}>
              <View style={{width: 100, height: 10, marginBottom: 6}} />
              <View style={{width: 180, height: 10}} />
            </View>
            <View style={{flexDirection: 'row', gap: 10}}>
              <View style={{width: 20, height: 20, borderRadius: 10}} />
              <View style={{width: 20, height: 20, borderRadius: 10}} />
            </View>
          </View>
        ))}
      </SkeletonPlaceholder>
    );
  };

  const renderEmptyComponent = () => {
    if (isLoading) {
      return renderSkeleton();
    }

    return (
      <View style={{marginTop: 40, flex: 1, justifyContent: 'center'}}>
        <FastImage
          resizeMode="contain"
          source={Images.no_data}
          style={[commonSty.size(200), commonSty.selfCenter]}
        />
        <Typography
          title={'No schedule call found'}
          align="center"
          size={20}
          color={COLORS.APP_PRIMARY_MAIN}
        />
      </View>
    );
  };

  return (
    <Container showHeader={false}>
      <AnimatedHeader title="Consulting call"/>
      <View style={{flex: 6, marginHorizontal: moderateScale(20)}}>
        <Typography
          title={'Upcoming Call'}
          size={18}
          color={'#727272'}
          mt={20}
        />
        <View style={{flex: 1}}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item?.id?.toString()}
            ListEmptyComponent={renderEmptyComponent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[COLORS.APP_PRIMARY_MAIN]}
                tintColor={COLORS.APP_PRIMARY_MAIN}
              />
            }
            contentContainerStyle={{flexGrow: 1}}
          />
        </View>
      </View>
      <View style={{flex: 1}}>
        <Button
          title="Schedule a call"
          btnStyle={commonSty.mt25}
          onPress={handleNavigate}
        />
      </View>

      <CustomConfirmModal
        open={openDeleteModal}
        title={'Vizayard'}
        submitLabel="Confirm"
        message={'Are you certain you want to cancel the scheduled call?'}
        cancelLabel="Cancel"
        handleConfirm={onClickConfirmButton}
        handleCancel={onClickCancelButton}
        loading={loader}
      />
    </Container>
  );
};

export default Consult;
