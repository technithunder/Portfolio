import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useFocusEffect, useIsFocused, useRoute} from '@react-navigation/native';
import {
  View,
  FlatList,
  BackHandler,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import styles from './style';
import {COLORS} from '../../config/colors';
import {AuthContext} from '../../context/AuthContext';
import {
  createVisaApplication,
  deleteChildUser,
  getAllChildUser,
} from '../../api';
import {commonSty} from '../../theme';
import {
  Button,
  Container,
  CustomConfirmModal,
  Icon,
  TravelSkeleton,
} from '../../components';
import {Typography} from '../../components';
import {FONTS} from '../../config/font';
import {Images, Routes} from '../../config';
import {goBack, navigate} from '../../utils';
import {MiniTravelers} from './components';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';
import HeaderWithBack from '../../components/HeaderWithBack';
import StepProcess from '../Traveller/StepProcess';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const TravelDetails = ({navigation}) => {
  const focus = useIsFocused();
  const {user} = useContext(AuthContext);
  const finalAppID = useSelector(state => state?.main?.travelersAppID);
  const route = useRoute();
  const {visaId, countryName, visaGaurrentedOn, additionalDocuments} =
    route?.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [childId, setChildId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loader, setLoader] = useState(false);
  console.log('additionalDocuments', additionalDocuments);
  console.log('data', data);

  console.log('57', visaId, countryName, visaGaurrentedOn, additionalDocuments);

  useEffect(() => {
    fetchAllChildUser();
  }, [focus]);

  const fetchAllChildUser = async () => {
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
    navigate(Routes.VisaProcess, {
      visaId: visaId,
      childUserId: item.id,
      isEdit: true,
      countryName: countryName,
      visaGaurrentedOn: visaGaurrentedOn,
      additionalDocuments: additionalDocuments,
    });
  };

  const handleItemPress = item => {
    const isAlreadySelected = selectedUser.some(i => i?.id === item?.id);

    if (isAlreadySelected) {
      setSelectedUser(prev => prev.filter(i => i?.id !== item?.id));
    } else if (!loading) {
      if (selectedUser.length >= 9) {
        Toast.show({
          type: 'error',
          text1: 'You can select up to 9 travellers only.',
          visibilityTime: 2000,
        });
      } else {
        setSelectedUser(prev => [...prev, item]);
      }
    }
  };

  const manageDeleteChild = ele => {
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
      // setLoader(false);
    }
  };

  const renderTravelDetails = ({item}) => {
    const isSelected = selectedUser.some(i => i?.id === item?.id);
    return (
      <MiniTravelers
        item={item}
        isSelected={isSelected}
        onItemPress={handleItemPress}
        onPressChildCard={onPressChildCard}
        onDelete={manageDeleteChild}
        additionalDocuments={additionalDocuments}
      />
    );
  };

  const renderEmptyComponent = () => {
    if (!isLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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

  const handleCreateNewChild = () => {
    navigate(Routes.VisaProcess, {
      visaId: visaId,
      isEdit: false,
      countryName: countryName,
      visaGaurrentedOn: visaGaurrentedOn,
      additionalDocuments: additionalDocuments,
    });
  };
  const isNextDisabled = selectedUser.length === 0;
  const handleCreateVisaApplication = async () => {
    const childUsers = selectedUser.map(item => item.id);
    const body = {
      parentUserId: user?.id,
      appId: finalAppID,
      visaId: visaId,
      childUsers: childUsers ?? [],
    };

    navigate(Routes.Checkout, {body});
  };

  return (
    <Container
      showHeader={false}
      contentContainerStyle={{flex: 1, backgroundColor: COLORS.APP_WHITE}}>
      <HeaderWithBack
        title={'Traveler Details'}
        onBack={() => navigation.navigate('Traveller', {visaId: visaId})}
      />
      <View
        style={{
          marginTop: 10,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.APP_GRAY_LIGHT,
          paddingBottom: 10,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <StepProcess step={2} />
        <View
          style={{
            backgroundColor: COLORS.APP_GRAY_LIGHT,
            paddingHorizontal: 14,
            borderRadius: 50,
            marginRight: 16,
          }}>
          <Text
            style={{
              color: '#374151',
              fontFamily: FONTS.INTER_MEDIUM,
              fontSize: 12,
            }}>{`${selectedUser?.length}/${data?.length}  Selected`}</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.APP_WHITE,
        }}>
        <ScrollView style={{flex: 1, paddingHorizontal: 16}}>
          <View>
            <FlatList
              data={data}
              keyExtractor={item => item?.id}
              contentContainerStyle={[commonSty.mt10]}
              showVerticalScrollIndicator={false}
              renderItem={renderTravelDetails}
            />
          </View>
          <TouchableOpacity
            onPress={handleCreateNewChild}
            style={styles.addNewTraveler}>
            <View style={styles.bgPlusIcon}>
              <Feather name="plus" size={22} />
            </View>
            <Text style={styles.txtAddNewTraveler}>Add New Traveller</Text>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: '#EFF6FF',
              padding: 10,
              borderRadius: 10,
              marginTop: 20,
              flexDirection: 'row',
            }}>
            <View style={{width: '10%'}}>
              <FontAwesome5 name="info-circle" size={18} color={'#3B82F6'} />
            </View>
            <View style={{width: '90%'}}>
              <Text style={{color: '#3B82F6', fontFamily: FONTS.INTER_MEDIUM}}>
                You can add up to 3 travellers in a single application. Each
                traveller will need to provide their passport details.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            paddingVertical: 20,
            paddingBottom: 30,
            backgroundColor: COLORS.APP_WHITE,
            borderTopColor: COLORS.APP_BORDER,
            borderTopWidth: 1,
          }}>
          <Button
            onPress={handleCreateVisaApplication}
            loading={loading}
            title="Continue"
            disabled={isNextDisabled}
          />
        </View>
      </View>
      {/* <View style={styles.subContainer}>
        <View style={commonSty.rowSpaceBetween}>
          <View style={commonSty.rowCenter}>
            <View style={styles.leftIconSubContainer}>
              <Icon
                name="chevron-back-outline"
                icon="Ionicons"
                color={COLORS.APP_PRIMARY_MAIN}
                onPress={() =>
                  navigation.navigate('Traveller', {visaId: visaId})
                }
              />
            </View>

            <Typography
              title={'Applicants Details'}
              size={20}
              font={FONTS.INTER_SEMIBOLD}
              ml={18}
            />
          </View>
          <Typography
            title={`${selectedUser?.length}  Selected`}
            size={12}
            color={COLORS.APP_PLACEHOLDER}
          />
        </View>

        <TravelSkeleton loading={isLoading && data?.length === 0} />
        <View style={commonSty.flex}>
          <FlatList
            data={data}
            keyExtractor={item => item?.id}
            contentContainerStyle={[commonSty.mt10, commonSty.pb50]}
            showVerticalScrollIndicator={false}
            renderItem={renderTravelDetails}
            ListEmptyComponent={renderEmptyComponent}
          />
        </View>
      </View> */}
      {/* <Button
        title="Add New Applicant"
        backgroundColor={COLORS.TRANSPARENT}
        txtClr={COLORS.APP_PRIMARY_MAIN}
        borderColor={COLORS.APP_PRIMARY_MAIN}
        onPress={handleCreateNewChild}
      />
      <Button
        title="Next"
        btnStyle={commonSty.mt10}
        disabled={isNextDisabled}
        onPress={handleCreateVisaApplication}
        loading={loading}
      /> */}
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

export default TravelDetails;
