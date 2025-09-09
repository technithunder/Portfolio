import React, {useEffect, useState} from 'react';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useSelector} from 'react-redux';
import moment from 'moment';
//relative path imports
import styles from './style';
import {Container, Typography} from '../../components';
import {Images, orderStatusData, Routes} from '../../constants';
import {COLORS} from '../../theme/colors';
import {
  getAllNotifications,
  getStaffProgress,
  addStaffProgress,
  updateStaffProgress,
  getDashboardData,
} from '../../api';
import TodayProgressReport from '../../components/Staff/TodayProgressReport';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FONTS} from '../../constants/fonts';
import {orderStatus} from '../../constants/data';

const Dashboard = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.user);

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [progressData, setProgressData] = useState({
    staffInTime: null,
    leadChecked: false,
    leadFollowed: false,
    tomorrowTasksChecked: false,
    reportingSheetSent: false,
    staffOutTime: null,
  });
  const [progressId, setProgressId] = useState(null);
  const [isProgressLoading, setIsProgressLoading] = useState(false);
  const [activeOrderData, setActiveOrderData] = useState([]);
  const [activeLeadData, setActiveLeadData] = useState([]);
  const [activeComplaintsData, setActiveComplaintsData] = useState([]);
  const [activeStaffData, setActiveStaffData] = useState([]);
  const [todayOrderData, setTodayOrderData] = useState([]);
  const [todayLeadData, setTodayLeadData] = useState([]);

  useEffect(() => {
    fetchAllNotifications();
    fetchTodayProgress();
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await getDashboardData();
      if (response?.data?.status === 'success') {
        setActiveOrderData(response?.data?.data?.orderActiveData);
        setActiveLeadData(response?.data?.data?.leadActiveData);
        setActiveComplaintsData(response?.data?.data?.complaintActiveData);
        setActiveStaffData(response?.data?.data?.topFourstaff);
        setTodayOrderData(response?.data?.data?.todayOrder);
        setTodayLeadData(response?.data?.data?.todayLead);
        console.log('===>60', response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const calculateProgressPercentage = () => {
    const checkboxFields = [
      progressData.leadChecked,
      progressData.leadFollowed,
      progressData.tomorrowTasksChecked,
      progressData.reportingSheetSent,
    ];

    const completedTasks = checkboxFields.filter(
      field => field === true,
    ).length;
    const totalTasks = checkboxFields.length;

    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchAllNotifications(),
        fetchTodayProgress(),
        fetchDashboardData(),
      ]);
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchAllNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await getAllNotifications(1, 3);
      if (response?.data?.status === 'success') {
        const fetchedNotifications = response?.data?.data?.data || [];
        setNotifications(fetchedNotifications);
      } else {
        console.error(
          'Failed to fetch notifications:',
          response?.data?.message,
        );
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTodayProgress = async () => {
    try {
      setIsProgressLoading(true);
      const response = await getStaffProgress();
      if (response?.data?.status === 'success') {
        const todayProgress = response?.data?.data;
        setProgressData({
          staffInTime: todayProgress?.inTime
            ? formatTime(todayProgress?.inTime)
            : null,
          leadChecked: todayProgress?.leadChecked || false,
          leadFollowed: todayProgress?.leadFollowed || false,
          tomorrowTasksChecked: todayProgress?.checkedTomorrowTasks || false,
          reportingSheetSent: todayProgress?.reportingSheetSent || false,
          staffOutTime: todayProgress?.outTime
            ? formatTime(todayProgress?.outTime)
            : null,
        });
        setProgressId(todayProgress?.id);
      }
    } catch (error) {
      console.log('Error fetching progress:', error);
    } finally {
      setIsProgressLoading(false);
    }
  };

  const formatTime = timeString => {
    if (!timeString) return null;
    return moment(timeString, 'HH:mm:ss').format('hh:mm A');
  };

  const getCurrentTime = () => {
    return moment().format('hh:mm A');
  };

  const getCurrentTimeForAPI = () => {
    return moment().format('HH:mm:ss');
  };

  const getCurrentDate = () => {
    return moment().format('YYYY-MM-DD');
  };

  const handleClockIn = async () => {
    if (progressData.staffInTime) {
      return {success: false, message: 'You have already clocked in today.'};
    }

    setIsProgressLoading(true);
    try {
      const currentTime = getCurrentTime();
      const apiTime = getCurrentTimeForAPI();
      const currentDate = getCurrentDate();

      const payload = {
        userId: user.id,
        date: currentDate,
        inTime: apiTime,
        leadChecked: false,
        leadFollowed: false,
        checkedTomorrowTasks: false,
        reportingSheetSent: false,
        outTime: null,
      };

      const response = await addStaffProgress(payload);

      if (response?.data?.status === 'success') {
        setProgressData(prev => ({
          ...prev,
          staffInTime: currentTime,
        }));
        setProgressId(response.data.data.id);
        return {success: true, message: `Clocked in at ${currentTime}`};
      } else {
        return {
          success: false,
          message: 'Failed to clock in. Please try again.',
        };
      }
    } catch (error) {
      console.error('Clock in error:', error);
      return {success: false, message: 'Failed to clock in. Please try again.'};
    } finally {
      setIsProgressLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!progressData.staffInTime) {
      return {success: false, message: 'Please clock in before clocking out.'};
    }

    if (progressData.staffOutTime) {
      return {success: false, message: 'You have already clocked out today.'};
    }

    if (!progressId) {
      return {
        success: false,
        message: 'No progress record found. Please contact support.',
      };
    }

    setIsProgressLoading(true);
    try {
      const currentTime = getCurrentTime();
      const apiTime = getCurrentTimeForAPI();

      const payload = {
        outTime: apiTime,
      };

      const response = await updateStaffProgress(progressId, payload);

      if (response?.data?.status === 'success') {
        setProgressData(prev => ({
          ...prev,
          staffOutTime: currentTime,
        }));
        return {success: true, message: `Clocked out at ${currentTime}`};
      } else {
        return {
          success: false,
          message: 'Failed to clock out. Please try again.',
        };
      }
    } catch (error) {
      console.error('Clock out error:', error);
      return {
        success: false,
        message: 'Failed to clock out. Please try again.',
      };
    } finally {
      setIsProgressLoading(false);
    }
  };

  const toggleCheckbox = async key => {
    if (!progressData.staffInTime) {
      return {
        success: false,
        message: 'Please clock in before updating your progress.',
      };
    }

    if (!progressId) {
      return {
        success: false,
        message: 'No progress record found. Please contact support.',
      };
    }

    setIsProgressLoading(true);
    try {
      const newValue = !progressData[key];

      const apiKeyMap = {
        leadChecked: 'leadChecked',
        leadFollowed: 'leadFollowed',
        tomorrowTasksChecked: 'checkedTomorrowTasks',
        reportingSheetSent: 'reportingSheetSent',
      };

      const payload = {
        [apiKeyMap[key]]: newValue,
      };

      const response = await updateStaffProgress(progressId, payload);

      if (response?.data?.status === 'success') {
        setProgressData(prev => ({
          ...prev,
          [key]: newValue,
        }));
        return {success: true, message: 'Progress updated successfully'};
      } else {
        return {
          success: false,
          message: 'Failed to update progress. Please try again.',
        };
      }
    } catch (error) {
      console.error('Update progress error:', error);
      return {
        success: false,
        message: 'Failed to update progress. Please try again.',
      };
    } finally {
      setIsProgressLoading(false);
    }
  };

  const renderStaffNames = (staffArray, prefix, staffKey = 'staff') => {
    if (!staffArray || !Array.isArray(staffArray)) {
      return (
        <Text style={{fontSize: 14, color: '#626262'}}>No staff assigned</Text>
      );
    }
    return (
      <View style={{flexDirection: 'row', gap: 5, marginTop: 5}}>
        {staffArray.map((staff, index) => {
          const firstName =
            staffKey === 'staff'
              ? staff?.staff?.firstName || ''
              : staff?.User?.firstName || '';
          const lastName =
            staffKey === 'staff'
              ? staff?.staff?.lastName || ''
              : staff?.User?.lastName || '';

          return (
            <Typography
              key={`${prefix}-staff-${index}-${firstName}-${lastName}`}
              size={12}>
              {`${firstName}${lastName}${
                index < staffArray.length - 1 ? ',' : ''
              }`}
            </Typography>
          );
        })}
      </View>
    );
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const statusCards = [
    {
      id: 1,
      title: 'Order Placed',
      image: Images.ongoing,
      value: 'order_placed',
    },
    {id: 2, title: 'Processing', image: Images.inprogress, value: 'processing'},
    {id: 3, title: 'Delivered', image: Images.completed, value: 'delivered'},
    {id: 4, title: 'Cancelled', image: Images.cancelled, value: 'cancelled'},
  ];
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.activityItem}
        onPress={() => console.log('Activity item pressed')}>
        <View style={styles.activityDetails}>
          <Text style={styles.activityText}>{item?.title}</Text>
          <Text style={styles.activityTime}>{item?.body}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const LoadingOverlay = () => {
    if (!isLoading && !isProgressLoading) return null;

    return (
      <View style={styles.loadingOverlay}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.APP_PRIMARY} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  };

  const InfoRow = ({label, value}) => (
    <View style={styles.infoRow}>
      <Typography title={label} size={14} font={FONTS.INTER_REGULAR} />
      <View style={label === 'Address' ? {width: '70%'} : {}}>
        <Typography
          title={value || ''} // Ensure value is never undefined
          style={{
            textAlign: 'right',
            fontSize: 14,
            color: '#626262',
            fontFamily: FONTS.INTER_REGULAR,
          }}
        />
      </View>
    </View>
  );
  const progressPercentage = calculateProgressPercentage();

  console.log('todayOderData', todayLeadData);

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: COLORS.APP_WHITE, paddingBottom: 30}}>
      <View
        style={{
          height: 50,
          paddingHorizontal: 20,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <TouchableOpacity onPress={openDrawer}>
          <Image source={Images.menu} style={{height: 18, width: 18}} />
        </TouchableOpacity>
        <Typography
          title={'Virtual Lights'}
          size={18}
          font={FONTS.INTER_SEMIBOLD}
        />
        <View />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.APP_PRIMARY]}
            tintColor={COLORS.APP_PRIMARY}
          />
        }>
        {user?.role === 'staff' && (
          <View style={{marginHorizontal: 20, marginTop: 15}}>
            <TodayProgressReport
              progressData={progressData}
              isLoading={isProgressLoading}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
              onToggleCheckbox={toggleCheckbox}
              progressPercentage={progressPercentage}
            />
          </View>
        )}

        <View style={{marginHorizontal: 20, marginTop: 30}}>
          <Text style={styles.sectionTitle}>Orders</Text>
        </View>
        {/* <View style={[styles.cardsContainer, {marginTop: 16}]}>
          {statusCards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() =>
                navigation.navigate(Routes.AdminOrder, {status: card.value})
              }>
              <Image
                source={card.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View> */}
        <View style={[styles.cardsContainer, {marginTop: 16}]}>
          {statusCards.map((card, index) => (
            <TouchableOpacity
              key={`status-card-${card.id}-${index}`} // <- Unique key
              style={styles.card}
              onPress={() =>
                navigation.navigate(Routes.AdminOrder, {status: card.value})
              }>
              <Image
                source={card.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>

        <View>
          {todayOrderData[0]?.orderNumber &&<View style={{marginHorizontal: 20, marginTop: 20}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.sectionTitle}>Today's Dispatches</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(Routes.ViewAdminTodayOrder, {
                    isTodayOrder: true,
                  })
                }
                style={styles.viewButton}>
                <Text style={styles.txtView}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.animatedCard}>
              {todayOrderData[0]?.orderNumber && (
                <InfoRow
                  label="Order Id"
                  value={todayOrderData[0]?.orderNumber}
                />
              )}
              {todayOrderData[0]?.status && (
                <InfoRow
                  label="Status"
                  value={orderStatus[todayOrderData[0]?.status]}
                />
              )}
              {todayOrderData[0]?.totalAmount && (
                <InfoRow
                  label="Order Amount"
                  value={`₹${todayOrderData[0]?.totalAmount.toFixed(2) ?? 0}`}
                />
              )}

              {todayOrderData[0]?.createdAt && (
                <InfoRow
                  label="Target Closing Date"
                  value={moment(todayOrderData[0]?.expectedDate).format(
                    'DD/MM/YYYY',
                  )}
                />
              )}
              {todayOrderData[0]?.customerName && (
                <InfoRow
                  label="Customer Name"
                  value={todayOrderData[0]?.customerName}
                />
              )}

              {todayOrderData[0]?.OrderStaffs?.length > 0 && (
                <View>
                  <Typography
                    title={'Assign To Staff'}
                    size={14}
                    font={FONTS.INTER_REGULAR}
                  />
                  {renderStaffNames(
                    todayOrderData[0]?.OrderStaffs,
                    'order',
                    'staff',
                  )}
                </View>
              )}
            </View>
          </View>}
        </View>
        <View>
          {todayLeadData[0]?.customerName && <View style={{marginHorizontal: 20, marginTop: 20}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.sectionTitle}>Today's Leads</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate(Routes.ViewAdminTodayLead)}
                style={styles.viewButton}>
                <Text style={styles.txtView}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.animatedCard}>
              {todayLeadData[0]?.customerName && (
                <InfoRow
                  label="Customer Name"
                  value={todayLeadData[0]?.customerName}
                />
              )}
              {todayLeadData[0]?.followUpDate && (
                <InfoRow
                  label="Follow Up Date"
                  value={moment(todayLeadData[0]?.followUpDate).format(
                    'DD/MM/YYYY',
                  )}
                />
              )}
              {todayLeadData[0]?.type && (
                <InfoRow label="Lead Type" value={todayLeadData[0]?.type} />
              )}

              {/* {todayLeadData[0]?.LeadStaffs?.length > 0 && (
                <View>
                  <Typography
                    title={'Lead Assign To Staff'}
                    size={14}
                    font={FONTS.INTER_REGULAR}
                  />
                  {renderStaffNames(
                    todayLeadData[0]?.LeadStaffs,
                    'lead',
                    'User',
                  )}
                </View>
              )} */}
            </View>
          </View>}
        </View>

        {activeOrderData[0]?.orderNumber ? (
          <View style={{marginHorizontal: 20, marginTop: 20}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.sectionTitle}>Current Orders Details</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate(Routes.ViewOrder)}
                style={styles.viewButton}>
                <Text style={styles.txtView}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.animatedCard}>
              {activeOrderData[0]?.orderNumber && (
                <InfoRow
                  label="Order Id"
                  value={activeOrderData[0]?.orderNumber}
                />
              )}
              {activeOrderData[0]?.status && (
                <InfoRow
                  label="Status"
                  value={orderStatus[activeOrderData[0]?.status]}
                />
              )}
              {activeOrderData[0]?.totalAmount && (
                <InfoRow
                  label="Order Amount"
                  value={`₹${activeOrderData[0]?.totalAmount.toFixed(2) ?? 0}`}
                />
              )}

              {activeOrderData[0]?.expectedDate && (
                <InfoRow
                  label="Target Closing Date"
                  value={moment(activeOrderData[0]?.expectedDate).format(
                    'DD/MM/YYYY',
                  )}
                />
              )}
              {activeOrderData[0]?.customerName && (
                <InfoRow
                  label="Customer Name"
                  value={activeOrderData[0]?.customerName}
                />
              )}

              {activeOrderData[0]?.OrderStaffs?.length > 0 && (
                <View>
                  <Typography
                    title={'Assign To Staff'}
                    size={14}
                    font={FONTS.INTER_REGULAR}
                  />
                  {renderStaffNames(
                    activeOrderData[0]?.OrderStaffs,
                    'order',
                    'staff',
                  )}
                </View>
              )}
            </View>
          </View>
        ) : null}

        {activeLeadData[0]?.customerName ? (
          <View style={{marginHorizontal: 20, marginTop: 20}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.sectionTitle}>Current Leads Details</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate(Routes.ViewLead)}
                style={styles.viewButton}>
                <Text style={styles.txtView}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.animatedCard}>
              {activeLeadData[0]?.customerName && (
                <InfoRow
                  label="Customer Name"
                  value={activeLeadData[0]?.customerName}
                />
              )}
              {activeLeadData[0]?.followUpDate && (
                <InfoRow
                  label="Follow Up Date"
                  value={moment(activeLeadData[0]?.followUpDate).format(
                    'DD/MM/YYYY',
                  )}
                />
              )}
              {activeLeadData[0]?.type && (
                <InfoRow label="Lead Type" value={activeLeadData[0]?.type} />
              )}

              {/* {activeLeadData[0]?.LeadStaffs?.length > 0 && (
                <View>
                  <Typography
                    title={'Lead Assign To Staff'}
                    size={14}
                    font={FONTS.INTER_REGULAR}
                  />
                  {renderStaffNames(
                    activeLeadData[0]?.LeadStaffs,
                    'lead',
                    'User',
                  )}
                </View>
              )} */}
            </View>
          </View>
        ) : null}

        {activeComplaintsData?.length > 0 ? (
          <View style={{marginHorizontal: 20, marginTop: 20}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.sectionTitle}>
                Current Complaints Details
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate(Routes.ViewComplaints)}
                style={styles.viewButton}>
                <Text style={styles.txtView}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.animatedCard}>
              {activeComplaintsData[0]?.orderId && (
                <InfoRow
                  label="Order Id"
                  value={activeComplaintsData[0]?.orderId}
                />
              )}
              {activeComplaintsData[0]?.status && (
                <InfoRow
                  label="Status"
                  value={activeComplaintsData[0]?.status}
                />
              )}
              {activeComplaintsData[0]?.description && (
                <InfoRow
                  label="Description"
                  value={activeComplaintsData[0]?.description}
                />
              )}
              {activeComplaintsData[0]?.targetCloseDate && (
                <InfoRow
                  label="Status"
                  value={moment(
                    activeComplaintsData[0]?.targetCloseDate,
                  ).format('DD/MM/YYYY')}
                />
              )}
              {activeComplaintsData[0]?.orderdata?.orderNumber && (
                <InfoRow
                  label="Order Number"
                  value={activeComplaintsData[0]?.orderdata?.orderNumber}
                />
              )}
              {activeComplaintsData[0]?.orderdata?.customerName && (
                <InfoRow
                  label="Customer Name"
                  value={activeComplaintsData[0]?.orderdata?.customerName}
                />
              )}

              {/* {activeComplaintsData[0]?.complaintStaffs?.length > 0 && (
                <View style={{marginTop: 5}}>
                  <Typography
                    title={'Lead Assign To Staff'}
                    size={14}
                    font={FONTS.INTER_REGULAR}
                  />
                  {renderStaffNames(
                    activeComplaintsData[0]?.complaintStaffs,
                    'complaint',
                    'User',
                  )}
                </View>
              )} */}
            </View>
          </View>
        ) : null}

        {user?.role !== 'staff' &&
          activeStaffData &&
          activeStaffData.length > 0 && (
            <View style={{marginHorizontal: 20, marginTop: 20}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.sectionTitle}>Staff Leaderboard</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate(Routes.ViewStaff)}
                  style={styles.viewButton}>
                  <Text style={styles.txtView}>View All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.animatedCard}>
                {activeStaffData[0]?.firstName && (
                  <InfoRow
                    label="Name"
                    value={`${activeStaffData[0].firstName} ${
                      activeStaffData[0]?.lastName || ''
                    }`}
                  />
                )}
                {typeof activeStaffData[0]?.ordersAssigned !== 'undefined' && (
                  <InfoRow
                    label="Orders Assigned"
                    value={String(activeStaffData[0].ordersAssigned)}
                  />
                )}
                {typeof activeStaffData[0]?.ordersDelivered !== 'undefined' && (
                  <InfoRow
                    label="Orders Delivered"
                    value={String(activeStaffData[0].ordersDelivered)}
                  />
                )}
                {typeof activeStaffData[0]?.leadsAssigned !== 'undefined' && (
                  <InfoRow
                    label="Leads Assigned"
                    value={String(activeStaffData[0].leadsAssigned)}
                  />
                )}
                {typeof activeStaffData[0]?.leadsConverted !== 'undefined' && (
                  <InfoRow
                    label="Leads Converted"
                    value={String(activeStaffData[0].leadsConverted)}
                  />
                )}
                {typeof activeStaffData[0]?.ordersSuccess !== 'undefined' && (
                  <InfoRow
                    label="Orders Success"
                    value={`${activeStaffData[0].ordersSuccess}%`}
                  />
                )}
                {typeof activeStaffData[0]?.leadsSuccess !== 'undefined' && (
                  <InfoRow
                    label="Leads Success"
                    value={`${activeStaffData[0].leadsSuccess}%`}
                  />
                )}
                {typeof activeStaffData[0]?.overallPerformance !==
                  'undefined' && (
                  <InfoRow
                    label="Overall Performance"
                    value={`${activeStaffData[0].overallPerformance}%`}
                  />
                )}
                {typeof activeStaffData[0]?.rank !== 'undefined' && (
                  <InfoRow label="Rank" value={`#${activeStaffData[0].rank}`} />
                )}
              </View>
            </View>
          )}

        <View style={styles.recentActivityContainer}>
          {notifications?.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(Routes.AdminBottomStack, {
                    screen: Routes.AdminNotification,
                  })
                }
                style={styles.viewButton}>
                <Text style={styles.txtView}>View All</Text>
              </TouchableOpacity>
            </View>
          )}
          <FlatList
            data={notifications}
            keyExtractor={(item, index) =>
              item.id ? `notification-${item.id}-${index}` : `notif-${index}`
            }
            renderItem={renderItem}
            scrollEnabled={false}
            nestedScrollEnabled={true}
          />
        </View>
      </ScrollView>

      <LoadingOverlay />
    </SafeAreaView>
  );
};

export default Dashboard;
