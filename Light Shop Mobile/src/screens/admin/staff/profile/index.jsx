import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
//relative path imports
import styles from './style';
import {Container, Icon, PickerSheet, Typography} from '../../../../components';
import {Images, Routes} from '../../../../constants';
import {COLORS} from '../../../../theme/colors';
import {FONTS} from '../../../../constants/fonts';
import LinearButton from '../../../../components/LinearButton';
import Entypo from 'react-native-vector-icons/Entypo';
import {navigate} from '../../../../utils';
import {useNavigation, useRoute} from '@react-navigation/native';
import {fetchStaffProfileApi, updateNote} from '../../../../api';
import moment from 'moment';
import {genderStatus, maritalStatus} from '../../../../utils/helper';
import FastImage from 'react-native-fast-image';
import NoteModal from './NoteModal';

const StaffProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {staffId} = route?.params;
  const editSheetRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // Default profile image
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true, // Default expanded
    personalInfo: false,
    qualificationInfo: false,
    contactInfo: false,
    bankInfo: false,
  });
  const [data, setData] = useState(null);
  const [isOpenNoteModal, setIsOpenNoteModal] = useState(false);
  const [isNoteLoading, setIsNoteLoading] = useState(false);
  const [editNotes, setEditNotes] = useState('');

  const ProgressData = [
    {title: 'Lead Checked', response: 'yes'},
    {title: 'Lead Followed', response: 'no'},
    {title: "Tomorrow's Task Checked ", response: 'yes'},
    {title: 'Reporting Sheet Sent', response: 'yes'},
  ];
  const title = '100%';
  const percentage = parseInt(title.replace('%', ''));

  const color =
    percentage === 0
      ? COLORS.APP_RED
      : percentage === 100
      ? COLORS.APP_GREEN
      : COLORS.APP_ORANGE;

  useEffect(() => {
    fetchStaffProfile(staffId);
  }, [staffId]);

  const fetchStaffProfile = async id => {
    setLoading(true);
    try {
      const response = await fetchStaffProfileApi(id);
      if (response?.data?.status === 'success') {
        console.log('==>data', response?.data?.data);
        setData(response?.data?.data);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const toggleSection = section => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleOpenActionSheet = () => {
    editSheetRef.current?.show();
  };
  const handleGetImages = image => {
    editSheetRef.current?.hide();
    setProfileImage(image);
  };

  const totalProgress = () => {
    const totalSteps = 4;

    // Count completed steps
    const completedSteps = [
      data?.ProgressInfo?.leadChecked,
      data?.ProgressInfo?.leadFollowed,
      data?.ProgressInfo?.checkedTomorrowTasks,
      data?.ProgressInfo?.reportingSheetSent,
    ].filter(Boolean).length;

    const totalProgress = (completedSteps / totalSteps) * 100;

    let title = `${totalProgress}%`;
    let color = COLORS.APP_BLACK;

    if (totalProgress < 50) color = COLORS.RED;
    else if (totalProgress < 100) color = COLORS.ORANGE;
    else color = COLORS.GREEN;

    return title;
  };

  const AccordionSection = ({title, isExpanded, onToggle, children}) => (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={onToggle}
        activeOpacity={0.7}>
        <Typography title={title} size={16} font={FONTS.INTER_MEDIUM} />
        <Icon
          icon="Entypo"
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={COLORS.APP_BLACK}
        />
      </TouchableOpacity>
      {isExpanded && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );

  const InfoRow = ({label, value}) => (
    <View style={styles.infoRow}>
      <Typography title={label} size={14} font={FONTS.INTER_REGULAR} />
      <View style={{width: label === 'Address' && '70%'}}>
        <Typography
          title={value}
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

  const onCloseNoteModal = () => {
    setIsOpenNoteModal(false);
  };

  const handleNoteSubmit = async notes => {
    try {
      setIsNoteLoading(true);
      const response = await updateNote(data?.ProgressInfo?.id, notes);
      if (response?.data?.status === 'success') {
        fetchStaffProfile(staffId);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsNoteLoading(false);
    }
  };

  const onPressNoteButton = () => {
    setIsOpenNoteModal(true);
    setEditNotes(data?.ProgressInfo?.notes);
  };

  return (
    <Container
      title={data?.BasicInfo?.empId || 'Staff Profile'}
      rightIcon={Images.edit}
      showBack={true}
      style={styles.container}
      onRightPress={() =>
        navigate(Routes.AdminStaffEditProfile, {staffId: data?.BasicInfo?.id})
      }
      onLeftPress={() =>
        navigate(Routes.DrawerStack, {
          screen: Routes.AdminStaff,
        })
      }>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={18} color={COLORS.APP_PRIMARY} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginHorizontal: 20, marginTop: 100}}>
            <View style={styles.profileCardSection}>
              <View
                style={{
                  marginTop: -70,
                  height: 120,
                  width: 120,
                  alignSelf: 'center',
                  borderWidth: 1,
                  borderRadius: 60,
                }}>
                <FastImage
                  source={
                    data?.PersonalInfo?.profilePic
                      ? {uri: data?.PersonalInfo?.profilePic}
                      : Images.user
                  }
                  style={styles.userProfile}
                />
                {/* <TouchableOpacity
                  onPress={handleOpenActionSheet}
                  style={styles.cameraIcon}>
                  <Entypo name="camera" size={18} color={COLORS.APP_WHITE} />
                </TouchableOpacity> */}
              </View>

              <Typography
                title={`${data?.BasicInfo?.firstName} ${data?.BasicInfo?.lastName}`}
                style={{
                  textAlign: 'center',
                  fontFamily: FONTS.INTER_MEDIUM,
                  marginTop: 16,
                  fontSize: 18,
                  color: COLORS.APP_BLACK,
                }}
              />
              {data?.BasicInfo?.position && (
                <Typography
                  title={data?.BasicInfo?.position}
                  style={{
                    textAlign: 'center',
                    fontFamily: FONTS.INTER_REGULAR,
                    fontSize: 16,
                    color: COLORS.APP_LIGHTER_GRAY,
                  }}
                />
              )}
              {data?.BasicInfo?.earning && (
                <LinearButton
                  title={`Earning: ${data?.BasicInfo?.earning}`}
                  style={{
                    borderRadius: 10,
                    marginHorizontal: 20,
                    marginTop: 20,
                  }}
                  gradientStyle={{height: 40, borderRadius: 10}}
                  textStyle={{
                    fontSize: 16,
                    fontFamily: FONTS.INTER_REGULAR,
                    color: COLORS.APP_WHITE,
                  }}
                />
              )}
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Typography
                title="Today's Progress"
                style={{
                  fontSize: 16,
                  color: COLORS.APP_BLACK,
                  fontFamily: FONTS.INTER_MEDIUM,
                  marginTop: 20,
                }}
              />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(Routes.ProgressReport, {
                    staffId: data?.BasicInfo?.id,
                  })
                }>
                <Typography
                  title="View full report"
                  style={{
                    fontSize: 14,
                    color: COLORS.APP_PRIMARY,
                    fontFamily: FONTS.INTER_MEDIUM,
                    marginTop: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.APP_PRIMARY,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                padding: 25,
                borderColor: '#ddd',
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.1,
                shadowRadius: 2,
                backgroundColor: COLORS.APP_WHITE,
                borderRadius: 10,
                marginTop: 20,
                borderRadius: 10,
                backgroundColor: '#fff',
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Typography
                  title="Staff In-Time"
                  size={16}
                  color={COLORS.APP_BLACK}
                  // font={FONTS.INTER_MEDIUM}
                />
                <Typography
                  title={data?.ProgressInfo?.inTime || '--:--'}
                  size={16}
                  color={COLORS.APP_BLACK}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 5,
                }}>
                <Typography
                  title="Lead Checked"
                  size={14}
                  color={COLORS.APP_GRAY}
                  // font={FONTS.INTER_MEDIUM}
                />
                <Typography
                  title={data?.ProgressInfo?.leadChecked ? 'Yes' : 'No'}
                  size={14}
                  color={
                    data?.ProgressInfo?.leadChecked
                      ? COLORS.APP_GREEN
                      : COLORS.APP_RED
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 5,
                }}>
                <Typography
                  title="Lead Followed"
                  size={14}
                  color={COLORS.APP_GRAY}
                />
                <Typography
                  title={data?.ProgressInfo?.leadFollowed ? 'Yes' : 'No'}
                  size={14}
                  color={
                    data?.ProgressInfo?.leadFollowed
                      ? COLORS.APP_GREEN
                      : COLORS.APP_RED
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 5,
                }}>
                <Typography
                  title="Tomorrow's Task Checked"
                  size={14}
                  color={COLORS.APP_GRAY}
                />
                <Typography
                  title={
                    data?.ProgressInfo?.checkedTomorrowTasks ? 'Yes' : 'No'
                  }
                  size={14}
                  color={
                    data?.ProgressInfo?.checkedTomorrowTasks
                      ? COLORS.APP_GREEN
                      : COLORS.APP_RED
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 5,
                }}>
                <Typography
                  title="Reporting Sheet Sent"
                  size={14}
                  color={COLORS.APP_GRAY}
                />
                <Typography
                  title={data?.ProgressInfo?.reportingSheetSent ? 'Yes' : 'No'}
                  size={14}
                  color={
                    data?.ProgressInfo?.reportingSheetSent
                      ? COLORS.APP_GREEN
                      : COLORS.APP_RED
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 5,
                }}>
                <Typography
                  title="Staff Out-Time"
                  size={16}
                  color={COLORS.APP_BLACK}
                />
                <Typography
                  title={data?.ProgressInfo?.outTime || '--:--'}
                  size={16}
                  color={COLORS.APP_BLACK}
                />
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#cccccc',
                  marginVertical: 20,
                }}></View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Typography
                  title="Daily Progress"
                  size={14}
                  color={COLORS.APP_BLACK}
                  font={FONTS.INTER_SEMIBOLD}
                />
                <Typography
                  title={totalProgress()}
                  size={16}
                  color={color}
                  font={FONTS.INTER_SEMIBOLD}
                />
              </View>

              {data?.ProgressInfo?.inTime && (
                <View style={{marginTop: 16}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Typography
                      title="Note"
                      size={14}
                      color={COLORS.APP_BLACK}
                      font={FONTS.INTER_SEMIBOLD}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 20,
                      }}>
                      <TouchableOpacity
                        onPress={onPressNoteButton}
                        style={styles.addNoteButton}>
                        <Image
                          source={
                            data?.ProgressInfo?.notes
                              ? Images.edit
                              : Images.plus
                          }
                          style={{
                            height: 18,
                            width: 18,
                            tintColor: COLORS.APP_BLACK,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {data?.ProgressInfo?.notes && (
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: COLORS.APP_GRAY,
                        padding: 10,
                        marginTop: 10,
                        borderRadius: 10,
                      }}>
                      <Typography
                        title={data?.ProgressInfo?.notes}
                        size={14}
                        color={COLORS.APP_GRAY}
                      />
                    </View>
                  )}
                </View>
              )}
            </View>

            <View style={{marginTop: 15}}>
              <AccordionSection
                title="Basic Information"
                isExpanded={expandedSections.basicInfo}
                onToggle={() => toggleSection('basicInfo')}>
                {data?.BasicInfo?.empId && (
                  <InfoRow label="Employee ID" value={data?.BasicInfo?.empId} />
                )}
                {data?.BasicInfo?.role && (
                  <InfoRow label="Role" value={data?.BasicInfo?.role} />
                )}
                {data?.BasicInfo?.position && (
                  <InfoRow label="Position" value={data?.BasicInfo?.position} />
                )}
                {data?.BasicInfo?.joiningDate && (
                  <InfoRow
                    label="Joining Date"
                    value={moment(data?.BasicInfo?.joiningDate).format(
                      'DD MMM, YYYY',
                    )}
                  />
                )}
                <InfoRow
                  label="Name"
                  value={`${data?.BasicInfo?.firstName} ${data?.BasicInfo?.lastName}`}
                />
              </AccordionSection>

              {/* Personal Information Accordion */}
              {data?.PersonalInfo?.age && (
                <AccordionSection
                  title="Personal Information"
                  isExpanded={expandedSections.personalInfo}
                  onToggle={() => toggleSection('personalInfo')}>
                  {data?.PersonalInfo?.age && (
                    <InfoRow label="Age" value={data?.PersonalInfo?.age} />
                  )}
                  {data?.PersonalInfo?.gender && (
                    <InfoRow
                      label="Gender"
                      value={genderStatus[data?.PersonalInfo?.gender]}
                    />
                  )}
                  {data?.BasicInfo?.dob && (
                    <InfoRow
                      label="Date of Birth"
                      value={moment(data?.BasicInfo?.dob).format(
                        'DD MMM, YYYY',
                      )}
                    />
                  )}
                  {data?.PersonalInfo?.nationality && (
                    <InfoRow
                      label="Nationality"
                      value={data?.PersonalInfo?.nationality}
                    />
                  )}
                  {data?.PersonalInfo?.maritalStatus && (
                    <InfoRow
                      label="Marital Status"
                      value={maritalStatus[data?.PersonalInfo?.maritalStatus]}
                    />
                  )}
                  {data?.PersonalInfo?.address && (
                    <InfoRow
                      label="Address"
                      value={data?.PersonalInfo?.address}
                    />
                  )}
                </AccordionSection>
              )}

              {data?.BankInfo && (
                <AccordionSection
                  title="Bank Information"
                  isExpanded={expandedSections.bankInfo}
                  onToggle={() => toggleSection('bankInfo')}>
                  {data?.BankInfo?.pancard && (
                    <InfoRow label="Pancard" value={data?.BankInfo?.pancard} />
                  )}
                  {data?.BankInfo?.bankName && (
                    <InfoRow
                      label="Bank Name"
                      value={data?.BankInfo?.bankName}
                    />
                  )}
                  {data?.BankInfo?.bankBranchName && (
                    <InfoRow
                      label="Branch Name"
                      value={data?.BankInfo?.bankBranchName}
                    />
                  )}
                  {data?.BankInfo?.accountNumber && (
                    <InfoRow
                      label="Account No."
                      value={data?.BankInfo?.accountNumber}
                    />
                  )}
                  {data?.BankInfo?.ifscCode && (
                    <InfoRow
                      label="IFSC Code"
                      value={data?.BankInfo?.ifscCode}
                    />
                  )}
                </AccordionSection>
              )}

              {/* Qualification Information Accordion */}
              {data?.Qualification?.length > 0 && (
                <AccordionSection
                  title="Qualification Information"
                  isExpanded={expandedSections.qualificationInfo}
                  onToggle={() => toggleSection('qualificationInfo')}>
                  {data?.Qualification?.map((ele, index) => {
                    return (
                      <View key={index}>
                        <Typography
                          title={`Qualification ${index + 1}`}
                          size={14}
                          font={FONTS.INTER_MEDIUM}
                        />
                        {ele?.degree && (
                          <InfoRow label="Degree" value={ele?.degree} />
                        )}
                        {ele?.university && (
                          <InfoRow label="University" value={ele?.university} />
                        )}
                        {ele?.passingYear && (
                          <InfoRow
                            label="Passing Year"
                            value={ele?.passingYear}
                          />
                        )}
                        {ele?.percentage && (
                          <InfoRow
                            label="Percentage"
                            value={`${ele?.percentage} %`}
                          />
                        )}
                      </View>
                    );
                  })}
                </AccordionSection>
              )}

              {/* Contact Information Accordion */}
              <AccordionSection
                title="Contact Information"
                isExpanded={expandedSections.contactInfo}
                onToggle={() => toggleSection('contactInfo')}>
                {data?.ContactInfo?.mobileNumber && (
                  <InfoRow
                    label="Phone"
                    value={data?.ContactInfo?.mobileNumber}
                  />
                )}
                <InfoRow label="Email" value={data?.ContactInfo?.email} />
              </AccordionSection>
            </View>
          </View>
        </ScrollView>
      )}

      <PickerSheet
        sheetRef={editSheetRef}
        onImagePickerPress={handleGetImages}
      />

      <NoteModal
        visible={isOpenNoteModal}
        onClose={onCloseNoteModal}
        onSubmit={data => handleNoteSubmit(data)}
        notes={editNotes}
      />
    </Container>
  );
};

export default StaffProfile;
