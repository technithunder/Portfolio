import React, {useEffect, useRef, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Container, Icon, PickerSheet, Typography} from '../../../../components';
import {Images, Routes} from '../../../../constants';
import styles from './style';
import LinearButton from '../../../../components/LinearButton';
import {FONTS} from '../../../../constants/fonts';
import {COLORS} from '../../../../theme/colors';
import {navigate} from '../../../../utils';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {genderStatus, maritalStatus} from '../../../../utils/helper';
import {fetchStaffProfileApi} from '../../../../api';
import FastImage from 'react-native-fast-image';

const Profile = () => {
  const route = useRoute();
  const {dealerId} = route?.params;
  const user = useSelector(state => state.auth.user);
  const editSheetRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    personalInfo: false,
    qualificationInfo: false,
    addressInfo: false,
    contactInfo: false,
    bankInfo: false,
  });

  const [data, setData] = useState(null);

  useEffect(() => {
    fetchStaffProfile(dealerId);
  }, [dealerId]);

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

  console.log('=>', data);

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
      <Typography
        title={value}
        size={14}
        font={FONTS.INTER_REGULAR}
        color="#626262"
      />
    </View>
  );

  return (
    <Container
      title={data?.BasicInfo?.empId || 'Dealer Profile'}
      rightIcon={user.role !== 'staff' && Images.edit}
      showBack={true}
      style={styles.container}
      onLeftPress={() =>
        navigate(Routes.DrawerStack, {
          screen: Routes.AdminDealers,
        })
      }
      onRightPress={() =>
        navigate(Routes.AdminDealersEditProfile, {
          dealerId: data?.BasicInfo?.id,
        })
      }>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={18} color={COLORS.APP_PRIMARY} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginHorizontal: 20, marginTop: 100,paddingBottom:50}}>
            <View style={styles.profileCardSection}>
              <View
                style={{
                  marginTop: -70,
                  height: 120,
                  width: 120,
                  alignSelf: 'center',
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
              {/* <Typography
                title={data?.BasicInfo?.position}
                style={{
                  textAlign: 'center',
                  fontFamily: FONTS.INTER_REGULAR,
                  fontSize: 16,
                  color: COLORS.APP_LIGHTER_GRAY,
                }}
              /> */}
              {data?.BasicInfo?.discount && (
                <LinearButton
                  title={`Discount: ${data?.BasicInfo?.discount}%`}
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
            <View style={{marginTop: 20}}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.APP_DIVIDER,
                  paddingVertical: 10,
                }}
                onPress={() =>
                  navigate(Routes.AdminDealersOrder, {
                    dealerId: data?.BasicInfo?.id,
                  })
                }>
                <Typography
                  title={'Orders'}
                  size={16}
                  font={FONTS.INTER_MEDIUM}
                />
                <AntDesign name="right" size={18} color={COLORS.APP_BLACK} />
              </TouchableOpacity>

              {/* Basic Information Accordion */}
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
                {/* {data?.BasicInfo?.position && (
                  <InfoRow label="Position" value={data?.BasicInfo?.position} />
                )} */}
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
                  {data?.PersonalInfo?.dob && (
                    <InfoRow
                      label="Date of Birth"
                      value={moment(data?.PersonalInfo?.dob).format(
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
                  {data?.PersonalInfo?.gstNumber && (
                    <InfoRow
                      label="GST Number"
                      value={data?.PersonalInfo?.gstNumber}
                    />
                  )}
                  {data?.PersonalInfo?.companyName && (
                    <InfoRow
                      label="Company Name"
                      value={data?.PersonalInfo?.companyName}
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

              {data?.Address?.length > 0 && (
                <AccordionSection
                  title="Address Information"
                  isExpanded={expandedSections.addressInfo}
                  onToggle={() => toggleSection('addressInfo')}>
                  {data?.Address?.map((address, index) => (
                    <View key={index} style={styles.addressContainer}>
                      <View style={{marginVertical: 5}}>
                        <Typography
                          title={`Address ${index + 1}`}
                          size={14}
                          font={FONTS.INTER_SEMIBOLD}
                        />
                      </View>
                      <InfoRow label="Street" value={address?.street} />
                      <InfoRow label="City" value={address?.city} />
                      <InfoRow label="State" value={address?.state} />
                      <InfoRow label="Country" value={address?.country} />
                      <InfoRow label="Zip Code" value={address?.zipCode} />
                    </View>
                  ))}
                </AccordionSection>
              )}

              
              {/* Bank Information Accordion */}
              <AccordionSection
                title="Bank Information"
                isExpanded={expandedSections.bankInfo}
                onToggle={() => toggleSection('bankInfo')}>
                {data?.BankInfo?.accountNumber && (
                  <InfoRow
                    label="Account Number"
                    value={data?.BankInfo?.accountNumber}
                  />
                )}
                 {data?.BankInfo?.bankName && (
                  <InfoRow
                    label="Bank Name"
                    value={data?.BankInfo?.bankName}
                  />
                )}
                {data?.BankInfo?.bankBranchName && (
                  <InfoRow
                    label="Bank Branch Name"
                    value={data?.BankInfo?.bankBranchName}
                  />
                )}
               
                {data?.BankInfo?.ifscCode && (
                  <InfoRow
                    label="IFSC Code"
                    value={data?.BankInfo?.ifscCode}
                  />
                )}
                {data?.BankInfo?.panCardNumber && (
                  <InfoRow
                    label="PAN Card Number"
                    value={data?.BankInfo?.panCardNumber}
                  />
                )}
              </AccordionSection>
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
                {data?.ContactInfo?.email && (
                  <InfoRow label="Email" value={data?.ContactInfo?.email} />
                )}
              </AccordionSection>

            </View>
          </View>
        </ScrollView>
      )}

      <PickerSheet
        sheetRef={editSheetRef}
        onImagePickerPress={handleGetImages}
      />
    </Container>
  );
};

export default Profile;
