import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Images, Routes} from '../../../../constants';
import styles from './style';
import {Container, Icon, Typography} from '../../../../components';
import {COLORS} from '../../../../theme/colors';
import {FONTS} from '../../../../constants/fonts';
import LinearButton from '../../../../components/LinearButton';
import padding from '../../../../theme/padding';
import {useRoute} from '@react-navigation/native';
import {
  convertToUser,
  getAllAssignStaff,
  getAllLeadStaff,
  getSingleLead,
  removeLeadStaff,
} from '../../../../api';
import Toast from 'react-native-toast-message';
import AddLead from '../AddLead';
import {navigate} from '../../../../utils';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

const leadTypeText = {
  hot: 'Hot',
  warm: 'Warm',
  cold: 'Cold',
};

const LeadInfo = ({navigation}) => {
  const user = useSelector(state => state.auth.user);
  const route = useRoute();
  const leadId = route?.params?.leadId || null;
  const isLead = route?.params?.isLead;
  const isTodayLead = route?.params?.isTodayLead;
  const sheetRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [leadData, setLeadData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assignStaff, setAssignStaff] = useState([]);

  useEffect(() => {
    if (leadId) {
      fetchSingleLead(leadId);
      fetchAssignStaff(leadId);
    }
  }, [leadId]);

  const fetchAssignStaff = async leadId => {
    try {
      const response = await getAllLeadStaff(leadId);
      if (response?.data?.status === 'success') {
        setAssignStaff(response?.data?.data?.data?.assignedStaff);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchSingleLead = async id => {
    setIsLoading(true);
    try {
      const response = await getSingleLead(id);
      if (response?.data?.status === 'success') {
        setLeadData(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onSave = async () => {
    try {
      setLoading(true);
      let obj = {
        leadId: leadData?.id,
      };
      const response = await convertToUser(obj);
      if (response?.data?.status === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2:
            response?.data?.message || 'Lead converted to user successfully',
        });
        navigation.navigate(Routes.DrawerStack, {
          screen: Routes.AdminDealers,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // const onLead = () => {
  //   fetchSingleLead(leadId);
  //   sheetRef.current?.hide();
  // };

  const onPressEditIcon = () => {
    navigation.navigate(Routes.ManageLead, {leadId: leadData?.id});
    // sheetRef.current?.show();
  };

  const onDelete = async id => {
    try {
      let obj = {
        leadId: leadId,
        staffId: id,
      };
      const response = await removeLeadStaff(obj);
      if (response?.data?.status === 'success') {
        fetchAssignStaff(leadId);
        setLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Staff deleted successfully',
        });
      }
    } catch (e) {
      setLoading(false);
      console.error('Error deleting staff:', e);
    }
  };

  const renderNoteButton = () => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(Routes.ManageNote, {id: leadId})}
        style={styles.noteButton}>
        <Ionicons
          name="chatbox-ellipses-outline"
          size={28}
          color={COLORS.APP_WHITE}
        />
      </TouchableOpacity>
    );
  };

  const renderAssignUser = () => {
    return (
      <View style={{marginTop: 10, marginBottom: 20}}>
        <Typography title={'Assign User'} size={18} font={FONTS.INTER_MEDIUM} />
        <TouchableOpacity
          onPress={() => navigate(Routes.LeadStaff, {leadId: leadId})}
          style={[
            styles.uploadButton,
            {alignItems: 'center', justifyContent: 'center'},
          ]}>
          <Typography
            title={'Select Staff'}
            font={FONTS.INTER_REGULAR}
            size={14}
          />
        </TouchableOpacity>

        {assignStaff?.length > 0 && (
          <View style={styles.assignUserCard}>
            <FlatList
              data={assignStaff}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      justifyContent: 'space-between',
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.APP_LIGHT_GRAY,
                      paddingVertical: 10,
                    }}
                    key={index}>
                    <Typography
                      title={`${item?.firstName} ${item?.lastName}`}
                      font={FONTS.INTER_REGULAR}
                    />
                    {loading ? (
                      <ActivityIndicator size={16} color={'red'} />
                    ) : (
                      <Icon
                        onPress={() => onDelete(item.id)}
                        icon="MaterialCommunityIcons"
                        name="delete"
                        size={24}
                        color={'red'}
                      />
                    )}
                  </View>
                );
              }}
            />
          </View>
        )}
      </View>
    );
  };

  console.log(leadData);

  return (
    <Container
      title={'Profile'}
      rightIcon={Images.edit}
      onRightPress={onPressEditIcon}
      onLeftPress={() => {
        isTodayLead
          ? navigation.navigate(Routes.ViewAdminTodayLead)
          : isLead
          ? navigation.navigate(Routes.ViewLead)
          : navigation.navigate(Routes.DrawerStack, {
              screen: Routes.AdminBottomStack,
              params: {
                screen: Routes.AdminLeads,
              },
            });
      }}
      showBack={true}
      style={styles.container}>
      {isLoading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={24} color={COLORS.APP_PRIMARY} />
        </View>
      ) : (
        <View style={{marginHorizontal: 20, marginTop: 20}}>
          <View style={styles.card}>
            <Typography
              title={'Name'}
              size={14}
              color={COLORS.APP_GRAY}
              font={FONTS.INTER_REGULAR}
            />
            <Typography
              title={leadData?.customerName}
              size={16}
              font={FONTS.INTER_MEDIUM}
            />
          </View>
          <View style={styles.card}>
            <Typography
              title={'Number'}
              size={14}
              color={COLORS.APP_GRAY}
              font={FONTS.INTER_REGULAR}
            />
            <Typography
              title={leadData?.mobileNumber}
              size={16}
              font={FONTS.INTER_MEDIUM}
            />
          </View>
          <View style={styles.card}>
            <Typography
              title={'Details'}
              size={14}
              color={COLORS.APP_GRAY}
              font={FONTS.INTER_REGULAR}
            />
            <Typography
              title={leadData?.requirement}
              size={16}
              font={FONTS.INTER_MEDIUM}
            />
          </View>
          <View style={styles.card}>
            <Typography
              title={'Reference'}
              size={14}
              color={COLORS.APP_GRAY}
              font={FONTS.INTER_REGULAR}
            />
            <Typography
              title={leadTypeText[leadData?.type]}
              size={16}
              font={FONTS.INTER_MEDIUM}
            />
          </View>
          {user?.role !== 'staff' && <View>{renderAssignUser()}</View>}

          <View style={{alignSelf: 'center', marginTop: 20}}>
            <LinearButton
              title="Convert into Customer"
              onPress={onSave}
              loading={loading}
              gradientStyle={{height: 40, width: 210}}
              textStyle={{
                fontSize: 16,
                fontFamily: FONTS.INTER_REGULAR,
                color: COLORS.APP_WHITE,
              }}
            />
          </View>
        </View>
      )}
      {/* {renderNoteButton()} */}
      {/* <AddLead sheetRef={sheetRef} onLead={onLead} leadData={leadData} /> */}
    </Container>
  );
};

export default LeadInfo;
