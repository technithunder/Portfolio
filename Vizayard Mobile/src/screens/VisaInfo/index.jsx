import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Clipboard,
  ToastAndroid,
  Platform,
  Alert,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './style';
import {COLORS} from '../../config/colors';
import StyledButton from '../../components/StyledButton';
import {getSingleVisa} from '../../api';
import {commonSty} from '../../theme';
import {Container, Icon, Typography, VisaInfoSkeleton} from '../../components';
import {useDispatch} from 'react-redux';
import {addVisaDetails} from '../../redux/MainSlice';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {WIDTH} from '../../theme/commSty';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FONTS} from '../../config/font';
import PhotoModal from '../../components/PhotoModal';
import ProcessFlow from './components';
import {Images} from '../../config';

const icon = {
  passport: Images.passport_icon,
  photo: Images.photo_icon,
  bankStatement: Images.bank_icon,
  incomeTaxReturn: Images.income_icon,
  hotelReservation: Images.hotel_icon,
  travelInsurance: Images.insurance_icon,
};

const VisaInfo = ({navigation}) => {
  const route = useRoute();
  const dispatch = useDispatch();
  const {visaID} = route?.params || {};
  const isExplore = route?.params?.isExplore;
  console.log(visaID);
  const [visaDetails, setVisaDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [isOpenPhotoModal, setIsOpenPhotoModal] = useState(false);
  const [expandedRequireDocuments, setExpandedRequireDocuments] =
    useState(false);
  console.log('visaID', visaDetails);

  useEffect(() => {
    if (visaID) {
      fetchSingleVisa(visaID);
    }
  }, [visaID]);

  const fetchSingleVisa = async id => {
    setLoading(true);
    try {
      const response = await getSingleVisa(id);
      setVisaDetails(response?.data?.data);
      dispatch(addVisaDetails(response?.data?.data));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching visa details:', error);
    }
  };

  const toggleExpand = index => {
    if (selectedFaq.includes(index)) {
      setSelectedFaq(selectedFaq.filter(item => item !== index));
    } else {
      setSelectedFaq([...selectedFaq, index]);
    }
  };

  const copyRequiredDocuments = () => {
    const countryName = visaDetails?.basicDetails?.countryName || '';
    const documents =
      visaDetails?.documents?.map(doc => `• ${doc?.label}`).join('\n') || '';

    const textToCopy = `${countryName} - Required Documents:\n\n${documents}`;

    Clipboard.setString(textToCopy);

    // Show toast message
    if (Platform.OS === 'android') {
      ToastAndroid.show(
        'Required documents copied to clipboard!',
        ToastAndroid.SHORT,
      );
    } else {
      Alert.alert('Copied!', 'Required documents copied to clipboard!');
    }
  };

  const renderItem = ({item, index}) => {
    const isSelected = selectedFaq.includes(index);
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => toggleExpand(index)}>
          <Text style={styles.text}>{item.question}</Text>
          <Feather
            name={isSelected ? 'chevron-down' : 'chevron-right'}
            size={22}
            color="#9CA3AF"
          />
        </TouchableOpacity>
        {isSelected && (
          <View style={styles.answerContainer}>
            <Text style={styles.answerText}>{item.answer}</Text>
          </View>
        )}
      </View>
    );
  };

  const handleStartVisa = async () => {
    await AsyncStorage.removeItem('visaDetails');
    let filteredDocuments = visaDetails?.documents?.filter(
      doc =>
        doc?.value?.toLowerCase() !== 'passport' &&
        doc?.value?.toLowerCase() !== 'photo',
    );
    const incomeTaxReturnDoc = filteredDocuments.find(
      doc => doc.value === 'incomeTaxReturn',
    );

    if (incomeTaxReturnDoc) {
      filteredDocuments = filteredDocuments.filter(
        doc => doc.value !== 'incomeTaxReturn',
      );

      filteredDocuments.push(
        {
          label: 'Income Tax Return year of 1',
          value: 'incomeTaxReturn1',
        },
        {
          label: 'Income Tax Return year of 2',
          value: 'incomeTaxReturn2',
        },
        {
          label: 'Income Tax Return year of 3',
          value: 'incomeTaxReturn3',
        },
      );
    }
    navigation.navigate('Traveller', {
      visaId: visaDetails?.id,
      countryName: visaDetails?.basicDetails?.countryName,
      visaGaurrentedOn: visaDetails?.visaDetails?.visaGaurrentedOn,
      additionalDocuments: filteredDocuments,
      visaProcessingDays: visaDetails?.visaDetails?.visaProcessingDays,
    });
  };

  const faqData = visaDetails?.additionalDetails?.faqs || [];

  return (
    <>
      <Container showHeader={false}>
        {loading ? (
          <VisaInfoSkeleton loading />
        ) : (
          <View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={commonSty.pb100}>
              <View style={styles.imageWrapper}>
                {/* Background Image */}
                <FastImage
                  source={{
                    uri:
                      visaDetails?.basicDetails?.coverImage[0] ||
                      visaDetails?.basicDetails?.coverImage[0],
                    priority: FastImage.priority.high,
                  }}
                  onLoad={() => setImageLoading(false)}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.mainImage}
                />

                <View style={styles.overlay} />

                <TouchableOpacity
                  style={[
                    commonSty.mt15,
                    commonSty.ml10,
                    {
                      backgroundColor: "#FFFFFF33",
                      height: 30,
                      width: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 20,
                      position: 'absolute',
                      top: 5,
                      left: 5,
                      zIndex: 999,
                    },
                  ]}
                  onPress={() =>
                    isExplore
                      ? navigation.navigate('Bottom', {screen: 'Explore'})
                      : navigation.navigate('Bottom')
                  }>
                  <Ionicons
                    name="arrow-back"
                    size={20}
                    color={COLORS.APP_WHITE}
                  />
                </TouchableOpacity>

                <Text style={styles.txtCountryName}>
                  {visaDetails?.basicDetails?.countryName}
                </Text>

                <Text style={styles.txtDescriptions}>
                  {`You can get ${
                    visaDetails?.basicDetails?.countryName
                  } visa in ${
                    visaDetails?.visaDetails?.visaProcessingDays > 1
                      ? `${visaDetails?.visaDetails?.visaProcessingDays} days`
                      : `${visaDetails?.visaDetails?.visaProcessingDays} day`
                  }`}
                </Text>

                {imageLoading && (
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item
                      width={WIDTH}
                      height={180}
                      alignSelf="center"
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                    />
                  </SkeletonPlaceholder>
                )}
              </View>

              <View>
                <View style={styles.travellerDetailsSection}>
                  <View>
                    <View style={commonSty.rowSpaceBetween}>
                      <Text style={[styles.txtPassportNumber, commonSty.mt5]}>
                        Visa Fee
                      </Text>
                      <Text style={[styles.txtTravellerName, styles.size14]}>
                        ₹
                        {parseInt(
                          parseFloat(visaDetails?.visaDetails?.visaFee),
                        )?.toFixed(2)}
                      </Text>
                    </View>
                    {visaDetails?.visaDetails?.vizayardFee && (
                      <View style={commonSty.rowSpaceBetween}>
                        <Text style={[styles.txtPassportNumber, commonSty.mt5]}>
                          Platform Fee
                        </Text>
                        <Text style={[styles.txtTravellerName, styles.size14]}>
                          ₹
                          {parseInt(
                            parseFloat(visaDetails?.visaDetails?.vizayardFee),
                          )?.toFixed(2)}
                        </Text>
                      </View>
                    )}
                    <View style={styles.horizontalLine} />
                    <View style={commonSty.rowSpaceBetween}>
                      <Text
                        style={[styles.txtTravellerDetails, {fontSize: 14}]}>
                        Total Amount
                      </Text>
                      {visaDetails?.visaDetails?.vizayardFee ? (
                        <Text
                          style={[styles.txtTravellerDetails, {fontSize: 14}]}>
                          ₹
                          {parseFloat(
                            parseInt(visaDetails?.visaDetails?.visaFee) +
                              parseInt(visaDetails?.visaDetails?.vizayardFee),
                          )?.toFixed(2)}
                        </Text>
                      ) : (
                        <Text
                          style={[styles.txtTravellerDetails, {fontSize: 14}]}>
                          ₹
                          {parseFloat(
                            parseInt(visaDetails?.visaDetails?.visaFee),
                          )?.toFixed(2)}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                {visaDetails?.documents?.length > 0 && (
                  <View style={[{marginTop: 5, marginHorizontal: 16}]}>
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingVertical: 8,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                            justifyContent: 'space-between',
                            width: '100%',
                          }}>
                          <Text style={styles.txtTravellerDetails}>
                            Required Documents
                          </Text>
                          <View style={{marginLeft: 10}}>
                            <Icon
                              icon="Feather"
                              name="copy"
                              size={20}
                              color={COLORS.APP_PRIMARY_MAIN}
                              onPress={copyRequiredDocuments}
                            />
                          </View>
                        </View>
                      </View>
                    </View>

                    <>
                      {/* {visaDetails?.documents?.map((ele, index) => {
                        return (
                        
                          <View key={index} style={styles.documentContainer}>
                            <Icon
                              icon="AntDesign"
                              name="checkcircle"
                              size={16}
                              color={COLORS.APP_BLUE}
                            />
                            <Typography title={ele?.label} size={14} />
                          </View>
                        );
                      })} */}
                    </>

                    <FlatList
                      data={visaDetails?.documents}
                      numColumns={2}
                      columnWrapperStyle={{
                        justifyContent: 'space-between',
                        marginBottom: 10,
                        marginTop: 16,
                      }}
                      keyExtractor={(_, index) => index.toString()}
                      renderItem={({item, index}) => {
                        return (
                          <View style={styles.requireDocument}>
                            <View
                              style={{
                                backgroundColor: '#EFF6FF',
                                height: 50,
                                width: 50,
                                borderRadius: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Image
                                source={icon[item?.value]}
                                style={{
                                  height: 26,
                                  width: 26,
                                  resizeMode: 'contain',
                                }}
                              />
                            </View>
                            <Text style={styles.requiredDocumentLabel}>
                              {item?.label}
                            </Text>
                          </View>
                        );
                      }}
                    />
                  </View>
                )}

                <View style={styles.visaDetailsSection}>
                  <Text style={styles.txtTravellerDetails}>Visa Details</Text>
                  {/* <View style={styles.detailsContainer}>
                    <View style={styles.visaDetailsCard}>
                      <Octicons
                        name="credit-card"
                        size={24}
                        color={COLORS.APP_PRIMARY_MAIN}
                      />
                      <Text style={[styles.txtPassportNumber, styles.size12]}>
                        Visa Type
                      </Text>
                      <Text style={[styles.txtTravellerDetails, commonSty.mt5]}>
                        {visaDetails?.visaDetails?.visaType}
                      </Text>
                    </View>
                    <View style={styles.visaDetailsCard}>
                      <EvilIcons
                        name="calendar"
                        size={24}
                        color={COLORS.APP_PRIMARY_MAIN}
                      />
                      <Text style={[styles.txtPassportNumber, styles.size12]}>
                        Validity Period
                      </Text>
                      <Text style={[styles.txtTravellerDetails, commonSty.mt5]}>
                        {visaDetails?.visaDetails?.validityPeriod}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.detailsContainer}>
                    <View style={styles.visaDetailsCard}>
                      <SimpleLineIcons
                        name="plane"
                        size={24}
                        color={COLORS.APP_PRIMARY_MAIN}
                      />
                      <Text
                        style={[styles.txtPassportNumber, commonSty.size12]}>
                        Entry
                      </Text>
                      <Text style={[styles.txtTravellerDetails, commonSty.mt5]}>
                        {visaDetails?.visaDetails?.visaEntry}
                      </Text>
                    </View>
                    <View style={styles.visaDetailsCard}>
                      <MaterialCommunityIcons
                        name="speedometer-slow"
                        size={24}
                        color={COLORS.APP_PRIMARY_MAIN}
                      />
                      <Text
                        style={[styles.txtPassportNumber, commonSty.size12]}>
                        Length of Stay
                      </Text>
                      <Text style={[styles.txtTravellerDetails, commonSty.mt5]}>
                        {visaDetails?.visaDetails?.lengthOfStay}
                      </Text>
                    </View>
                  </View> */}

                  <View style={styles.detailsContainer}>
                    <View style={{gap: 15}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                        }}>
                        <View
                          style={{
                            height: 50,
                            width: 50,
                            backgroundColor: '#EFF6FF',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 50,
                          }}>
                          <Image
                            source={Images.visatype_icon}
                            style={{
                              height: 26,
                              width: 26,
                              resizeMode: 'contain',
                            }}
                          />
                        </View>
                        <View>
                          <Text style={styles.txtDetailsLabel}>Visa Type</Text>
                          <Text style={styles.txtDetailsValue}>
                            {visaDetails?.visaDetails?.visaType}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                        }}>
                        <View
                          style={{
                            height: 50,
                            width: 50,
                            backgroundColor: '#EFF6FF',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 50,
                          }}>
                          <Image
                            source={Images.validity_icon}
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: 'contain',
                            }}
                          />
                        </View>
                        <View>
                          <Text style={styles.txtDetailsLabel}>Validity</Text>
                          <Text style={styles.txtDetailsValue}>
                            {visaDetails?.visaDetails?.validityPeriod}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={{gap: 15}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                        }}>
                        <View
                          style={{
                            height: 50,
                            width: 50,
                            backgroundColor: '#EFF6FF',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 50,
                          }}>
                          <Image
                            source={Images.entry_icon}
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: 'contain',
                            }}
                          />
                        </View>
                        <View>
                          <Text style={styles.txtDetailsLabel}>Entry</Text>
                          <Text style={styles.txtDetailsValue}>
                            {visaDetails?.visaDetails?.visaEntry}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                        }}>
                        <View
                          style={{
                            height: 50,
                            width: 50,
                            padding: 10,
                            backgroundColor: '#EFF6FF',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 50,
                          }}>
                          <Image
                            source={Images.stay_icon}
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: 'contain',
                            }}
                          />
                        </View>
                        <View>
                          <Text style={styles.txtDetailsLabel}>
                            Length of Stay
                          </Text>
                          <Text style={styles.txtDetailsValue}>
                            {' '}
                            {visaDetails?.visaDetails?.lengthOfStay}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {visaDetails?.processFlow?.length > 0 && (
                  <View style={styles.visaDetailsSection}>
                    <Text style={styles.txtTravellerDetails}>Visa Process</Text>
                    <View style={{marginTop: 16}}>
                      <ProcessFlow data={visaDetails?.processFlow} />
                    </View>
                  </View>
                )}

                {visaDetails?.visaDetails?.approveVisaSampleImage && (
                  <View style={[{marginTop: 5, marginHorizontal: 16}]}>
                    <Text style={styles.txtTravellerDetails}>
                      Approved Visa Sample
                    </Text>
                    <TouchableOpacity
                      onPress={() => setIsOpenPhotoModal(true)}
                      style={{marginTop: 20}}>
                      <Image
                        source={{
                          uri: visaDetails?.visaDetails?.approveVisaSampleImage,
                        }}
                        style={{height: 100, width: 100}}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {faqData?.length > 0 && (
                  <View style={styles.faqSection}>
                    <Text style={styles.txtTravellerDetails}>
                      Frequently Asked Questions
                    </Text>
                    <View style={commonSty.mt20}>
                      <FlatList
                        data={faqData}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
                      />
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={styles.bottomView}>
              <View>
                <Text style={styles.txtVisaGauranteedOn}>
                  Visa Guaranteed on
                </Text>
                <Text style={styles.txtDateInfo}>
                  {`${moment
                    .utc(visaDetails?.visaDetails?.visaGaurrentedOn)
                    .format('ddd DD MMM,')} ${moment(
                    visaDetails?.visaDetails?.visaTime,
                    'HH:mm',
                  ).format('hh:mm A')}`}
                </Text>
              </View>
              <StyledButton
                onPress={handleStartVisa}
                title="Apply Now"
                style={styles.startVisaBtnStyle}
                textStyle={styles.size16}
              />
            </View>
          </View>
        )}

        {isOpenPhotoModal && (
          <PhotoModal
            visible={isOpenPhotoModal}
            onClose={() => setIsOpenPhotoModal(false)}
            imageUrl={visaDetails?.visaDetails?.approveVisaSampleImage}
          />
        )}
      </Container>
    </>
  );
};

export default VisaInfo;
