import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {Container, Icon, Typography} from '../../../../components';
import {Routes} from '../../../../constants';
import styles from './style';
import {
  getAllComplaintStaff,
  getSingleComplaint,
  removeComplaintStaff,
  updateComplaintStatus,
} from '../../../../api';
import {useSelector} from 'react-redux';
import {navigate} from '../../../../utils';
import {FONTS} from '../../../../constants/fonts';
import {colors, COLORS} from '../../../../theme/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {Dropdown} from 'react-native-element-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const options = [
  {
    label: 'Open',
    value: 'open',
  },
  {
    label: 'In Progress',
    value: 'in_progress',
  },
  {
    label: 'Resolved',
    value: 'resolved',
  },
  {
    label: 'Closed',
    value: 'closed',
  },
];

const ViewComplaints = ({navigation}) => {
  const route = useRoute();
  const complaintId = route?.params?.complaintId;
  const isComplaints = route?.params?.isComplaints;
  const user = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [assignStaff, setAssignStaff] = useState([]);
  const [openExpectedDatePicker, setOpenExpectedDatePicker] = useState(false);
  const [targetCloseDate, setTargetCloseDate] = useState(null);
  const [status, setStatus] = useState('');
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  useEffect(() => {
    if (complaintId) {
      fetchSingleComplaint(complaintId);
      fetchAssignStaff(complaintId);
    }
  }, [complaintId]);

  const fetchSingleComplaint = async id => {
    try {
      setIsLoading(true);
      const response = await getSingleComplaint(id);
      if (response?.data?.status === 'success') {
        setData(response?.data?.data);
        setStatus(response?.data?.data?.status);
        setTargetCloseDate(response?.data?.data?.targetCloseDate);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssignStaff = async complaintId => {
    try {
      const response = await getAllComplaintStaff(complaintId);
      if (response?.data?.status === 'success') {
        setAssignStaff(response?.data?.data?.data?.assignedStaff);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onDelete = async id => {
    try {
      let obj = {
        complaintId: complaintId,
        staffId: id,
      };
      const response = await removeComplaintStaff(obj);
      if (response?.data?.status === 'success') {
        fetchAssignStaff(complaintId);
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

  const handleJoiningDateConfirm = date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate >= today) {
      setTargetCloseDate(date);
    } else {
      Alert.alert('Invalid Date', 'Please select a date from today onwards.');
    }

    setOpenExpectedDatePicker(false);
  };

  console.log(data);

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'open':
        return '#FF6B6B';
      case 'closed':
        return '#96CEB4';
      case 'in_progress':
        return '#4ECDC4';
      case 'resolved':
        return '#45B7D1';
      default:
        return '#95A5A6';
    }
  };

  const getPriorityColor = priority => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#E74C3C';
      case 'medium':
        return '#F39C12';
      case 'low':
        return '#27AE60';
      default:
        return '#95A5A6';
    }
  };

  const onPressUpdateButton = async () => {
    try {
      setIsUpdateLoading(true);
      let obj = {};
      if (targetCloseDate) {
        obj['targetCloseDate'] = moment(targetCloseDate).format('YYYY-MM-DD');
      }
      if (status) {
        obj['status'] = status;
      }

      const response = await updateComplaintStatus(complaintId, obj);
      if (response?.data?.status === 'success') {
        fetchSingleComplaint(complaintId);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsUpdateLoading(true);
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderTargetClose = () => {
    return (
      <View
        style={{
          marginTop: 10,
          marginHorizontal: 20,
          marginTop: 20,
        }}>
        <Typography
          title={'Target Close Date'}
          size={18}
          font={FONTS.INTER_MEDIUM}
        />
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setOpenExpectedDatePicker(true)}>
          <Typography
            title={
              targetCloseDate
                ? moment(targetCloseDate).format('DD MMM, YYYY')
                : 'Select Date'
            }
            size={14}
            color={colors.black}
            font={FONTS.INTER_REGULAR}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPressUpdateButton}
          style={styles.updateButton}>
          <Typography title={'Update'} color={COLORS.APP_WHITE} size={16} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderStatusUpdate = () => {
    return (
      <View
        style={{
          marginTop: 10,
          marginBottom: 20,
          marginHorizontal: 20,
          marginTop: 20,
        }}>
        <Typography title={'Status'} size={18} font={FONTS.INTER_MEDIUM} />
        <Dropdown
          style={[styles.inputField, styles.dropdown]}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownSelectedText}
          inputSearchStyle={styles.dropdownSearch}
          iconStyle={styles.dropdownIcon}
          data={options}
          maxHeight={240}
          labelField="label"
          valueField="value"
          placeholder="Select Status"
          itemTextStyle={{color: COLORS.APP_BLACK}}
          value={status}
          onChange={item => {
            setStatus(item.value);
          }}
          renderRightIcon={() => (
            <MaterialIcons
              name="keyboard-arrow-down"
              size={20}
              color={COLORS.APP_GRAY}
            />
          )}
        />

        <TouchableOpacity
          onPress={onPressUpdateButton}
          style={styles.updateButton}>
          <Typography title={'Update'} color={COLORS.APP_WHITE} size={16} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderAssignUser = () => {
    return (
      <View style={{marginTop: 10, marginBottom: 20}}>
        <Typography title={'Assign Staff'} size={18} font={FONTS.INTER_MEDIUM} />
        <TouchableOpacity
          onPress={() =>
            navigate(Routes.AdminComplaintStaff, {complaintId: complaintId})
          }
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
                      backgroundColor: COLORS.APP_WHITE,
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

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={[styles.smallContainer]}>
          <Icon
            icon="Ionicons"
            name="chevron-back-outline"
            containerStyle={styles.leftIconSubContainer}
            onPress={() =>
              isComplaints
                ? navigation.navigate(Routes.ViewComplaints)
                : navigate(Routes.DrawerStack, {screen: Routes.AdminComplaints})
            }
            size={20}
            color={colors.primary}
          />
        </View>
        <Typography
          title={'View Complaints'}
          font={FONTS.INTER_MEDIUM}
          size={16}
        />
        <View />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {renderHeader()}
        <View style={styles.complaintCard} activeOpacity={0.7}>
          <View style={styles.complaintHeader}>
            <View style={styles.headerLeft}>
              <Text style={styles.orderId}>
                {data?.order?.orderNumber || `Order #${data?.orderId}`}
              </Text>
              <Text style={styles.customerName}>
                Customer: {data?.order?.customerName || 'N/A'}
              </Text>
            </View>
            <View style={styles.headerRight}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <View
                  style={[
                    styles.statusBadge,
                    {backgroundColor: getStatusColor(data?.status)},
                  ]}>
                  <Text style={styles.statusText}>
                    {data?.status?.toUpperCase() || 'UNKNOWN'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.complaintContent}>
            <Text style={styles.description}>
              {data?.description || 'No description available'}
            </Text>

            <View style={styles.metaInfo}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Priority:</Text>
                <View
                  style={[
                    styles.priorityBadge,
                    {backgroundColor: getPriorityColor(data?.priority)},
                  ]}>
                  <Text style={styles.priorityText}>
                    {data?.priority?.toUpperCase() || 'N/A'}
                  </Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Created:</Text>
                <Text style={styles.metaValue}>
                  {data?.createdAt ? formatDate(data?.createdAt) : 'N/A'}
                </Text>
              </View>

              {data?.targetCloseDate && (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Target Close:</Text>
                  <Text style={styles.metaValue}>
                    {formatDate(data?.targetCloseDate)}
                  </Text>
                </View>
              )}

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Complaint ID:</Text>
                <Text style={styles.metaValue}>#{data?.id}</Text>
              </View>
            </View>
          </View>
        </View>
        {renderTargetClose()}
        {renderStatusUpdate()}
        {user?.role !== 'staff' && (
          <View style={{marginHorizontal: 20}}>{renderAssignUser()}</View>
        )}
      </ScrollView>

      <DateTimePickerModal
        isVisible={openExpectedDatePicker}
        mode="date"
        date={targetCloseDate ? new Date(targetCloseDate) : new Date()}
        minimumDate={new Date()}
        onConfirm={handleJoiningDateConfirm}
        onCancel={() => setOpenExpectedDatePicker(false)}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />
    </SafeAreaView>
  );
};

export default ViewComplaints;
