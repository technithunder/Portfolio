import React, {useContext, useEffect, useState} from 'react';
import {View, Text, ScrollView, FlatList} from 'react-native';
import styles from './style';
import {
  Container,
  CustomConfirmModal,
  Icon,
  TravelSkeleton,
  Typography,
} from '../../components';
import {FONTS} from '../../config/font';
import {COLORS} from '../../config/colors';
import {AuthContext} from '../../context/AuthContext';
import {deleteChildUser, getAllChildUser} from '../../api';
import {commonSty} from '../../theme';
import {Images, Routes} from '../../config';
import {MiniTravelers} from '../TravelDetails/components';
import FastImage from 'react-native-fast-image';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {navigate, replace} from '../../utils';
import Toast from 'react-native-toast-message';
import HeaderWithBack from '../../components/HeaderWithBack';

const Personas = () => {
  const {user} = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [childId, setChildId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchAllChildUser(user?.id);
    }
  }, [user]);

  const fetchAllChildUser = async userId => {
    setIsLoading(true);
    try {
      const response = await getAllChildUser(user?.id);
      if (response?.data?.status) {
        setData(response?.data?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onPressChildCard = item => {
    // const filteredDocuments = item?.documents?.filter(
    //   (doc) => doc?.value?.toLowerCase() !== 'passport' && doc?.value?.toLowerCase() !== 'photo'
    // );
    navigate(Routes.VisaProcess, {
      visaId: item.visaId,
      childUserId: item.id,
      isEdit: true,
      isPersonas: true,
      // additionalDocuments: filteredDocuments,
    });
  };

  const manageDeleteIcon = ele => {
    setChildId(ele?.id);
    setOpenDeleteModal(true);
    console.log('Delete Icon Pressed:', ele);
  };

  const onClickCancelButton = () => {
    setChildId(null);
    setOpenDeleteModal(false);
    setLoader(false);
  };

  const onClickConfirmButton = async () => {
    setLoader(true);
    try {
      const response = await deleteChildUser(childId);
      if (response?.data?.status) {
        Toast.show({
          type: 'success',
          text1: 'Applicant deleted successfully',
        });
        fetchAllChildUser();
        onClickCancelButton();
      }
    } catch (e) {
      console.log('Error in deleting schedule call', e);
      Toast.show({
        type: 'error',
        text1: 'Failed to delete Applicant',
      });
      onClickCancelButton();
    } finally {
      onClickCancelButton();
    }
  };

  const renderEmptyComponent = () => {
    if (!isLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',height:'100%'}}>
          <FastImage
            resizeMode="contain"
            source={Images.no_data}
            style={[commonSty.size(200), commonSty.selfCenter]}
          />
          <Typography
            title={'No traveller found'}
            align="center"
            size={20}
            color={COLORS.APP_PRIMARY_MAIN}
          />
        </View>
      );
    }
    return null;
  };

  const renderTravelDetails = ({item}) => {
    const isCompletedUser =
      !!item?.details?.firstName && !!item?.details?.lastName;
    const userName = item?.details?.firstName + ' ' + item?.details?.lastName;
    return (
      <View style={styles.detailContainer}>
        <View>
          {imageLoading && (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                width={styles.profileImg?.width}
                height={styles.profileImg?.height}
                borderRadius={6}
                backgroundColor={COLORS.APP_PLACEHOLDER}
                position="absolute"
                zIndex={-99}
              />
            </SkeletonPlaceholder>
          )}
          <FastImage
            resizeMode="cover"
            source={{uri: item?.photo, priority: FastImage.priority.high}}
            style={styles.profileImg}
            onLoad={() => setImageLoading(false)}
          />
        </View>
        <View style={styles.detailText}>
          {isCompletedUser ? (
            <View>
              <Typography title={userName} size={14} numberOfLines={1} />
              <Typography
                title={`Place Of Birth: ${item?.details?.placeOfBirth || ''}`}
                size={10}
                color={COLORS.APP_PLACEHOLDER}
                mt={1}
                numberOfLines={1}
              />
            </View>
          ) : (
            <View>
              <Typography
                color={COLORS.APP_PRIMARY_MAIN}
                title={'Draft'}
                font={FONTS.INTER_REGULAR}
                size={14}
                txtStyle={{fontStyle: 'italic'}}
              />
            </View>
          )}
        </View>
        <View style={styles.rightContainer}>
          <Icon
            icon="MaterialCommunityIcons"
            name="delete"
            size={22}
            color={COLORS.APP_RED}
            onPress={() => manageDeleteIcon(item)}
          />
         
        </View>
      </View>
    );
  };

  console.log('Personas data:', data);

  return (
    <Container
      containerStyle={{
        backgroundColor: COLORS.APP_WHITE,
        flex: 1,
      }}
      showHeader={false}>
      <HeaderWithBack
        title={'Persona'}
        onBack={() => replace(Routes.Bottom, {screen: 'Profile'})}
      />
      <View style={{marginHorizontal: 16, flex: 1}}>
        <TravelSkeleton loading={isLoading && data?.length === 0} />
        <View style={commonSty.flex}>
          <FlatList
            data={data}
            keyExtractor={item => item?.id}
            contentContainerStyle={[commonSty.pb50,{flexGrow:1}]}
            showVerticalScrollIndicator={false}
            renderItem={renderTravelDetails}
            ListEmptyComponent={renderEmptyComponent}
          />
        </View>
      </View>
      <CustomConfirmModal
        open={openDeleteModal}
        title={'Vizayard'}
        submitLabel="Confirm"
        message={'Are you certain you want to delete the applicant?'}
        cancelLabel="Cancel"
        handleConfirm={onClickConfirmButton}
        handleCancel={onClickCancelButton}
        loading={loader}
      />
    </Container>
  );
};

export default Personas;
