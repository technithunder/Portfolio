import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Linking,
  Platform,
  FlatList,
  Image,
} from 'react-native';
import {Container, Icon, Typography} from '../../components';
import FastImage from 'react-native-fast-image';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {commonSty} from '../../theme';
import {COLORS} from '../../config/colors';
import {goBack} from '../../utils';
import {useRoute} from '@react-navigation/native';
import {getSingleVisaApplication} from '../../api';
import moment from 'moment';
import {FONTS} from '../../config/font';
import {
  applicationStatusBgColor,
  applicationStatusText,
  applicationStatusTextColor,
  Images,
} from '../../config';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import RNFS from 'react-native-fs';
import {PermissionsAndroid} from 'react-native';
import ApplicationProgressBar from './ApplicationProgressBar';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PendingDocuments from './PendingDocuments';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CommonButton from '../../components/CommonButton';
import {convertPdfToBase64, convertToBase64} from '../../utils/helper';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import CommonBottomSheet from '../../components/BottomSheet';

const STATUS_ORDER = ['approved', 'under-review', 'completed', 'rejected'];

const ApplicationDetailSkeleton = () => {
  return (
    <ScrollView contentContainerStyle={commonSty.pb100}>
      <SkeletonPlaceholder>
        {/* Cover Image Skeleton */}
        <View style={{height: moderateScale(230), width: '100%'}} />

        {/* Country Name & Status Skeleton */}
        <View
          style={{
            marginHorizontal: 15,
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{width: 200, height: 28, borderRadius: 4}} />
          <View style={{width: 80, height: 30, borderRadius: 50}} />
        </View>

        {/* Visa Details Card Skeleton */}
        <View style={[styles.card, {marginTop: 20}]}>
          <View style={{width: 100, height: 24, borderRadius: 4}} />
        </View>

        {/* Payment Details Card Skeleton */}
        <View style={[styles.card, {marginTop: 20}]}>
          <View style={{width: 120, height: 24, borderRadius: 4}} />
        </View>

        {/* Applicants Section Skeleton */}
        <View style={{marginHorizontal: 15, marginTop: 15}}>
          <View style={{width: 100, height: 20, borderRadius: 4}} />
        </View>

        {/* Applicant Cards Skeleton */}
        {[1, 2].map((_, index) => (
          <View key={index} style={[styles.card, {marginTop: 20}]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
              <View
                style={{
                  width: moderateScale(40),
                  height: moderateScale(40),
                  borderRadius: 50,
                }}
              />
              <View>
                <View style={{width: 150, height: 18, borderRadius: 4}} />
                <View
                  style={{
                    width: 80,
                    height: 14,
                    borderRadius: 4,
                    marginTop: 5,
                  }}
                />
              </View>
            </View>
          </View>
        ))}
      </SkeletonPlaceholder>
    </ScrollView>
  );
};

const ApplicationDetail = ({navigation}) => {
  const route = useRoute.params;
  const id = route?.data;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const bottomSheetRef = useRef(null);
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [documentLoadingStates, setDocumentLoadingStates] = useState({});

  const file = require('../../../assets/images/file.png');
  // const info = require('../../../assets/images/infoInApp.png');
  const vizaCategory = require('../../../assets/images/vizaCategory.png');
  const vizaApplied = require('../../../assets/images/vizaApplied.png');
  const vizaType = require('../../../assets/images/vizaType.png');
  const planeInApp = require('../../../assets/images/planeInApp.png');
  const viza = require('../../../assets/images/viza.png');
  const calender = require('../../../assets/images/calender.png');
  const clock = require('../../../assets/images/clock.png');
  const ProcessingTime = require('../../../assets/images/processingTime.png');
  const garanteeDate = require('../../../assets/images/garanteeDate.png');

  useEffect(() => {
    if (id) {
      fetchSingleVisaApplication();
    }
  }, [id]);

  const fetchSingleVisaApplication = async () => {
    setLoading(true);
    try {
      const response = await getSingleVisaApplication(id);
      if (response?.data?.status) {
        setData(response?.data?.data);
      }
    } catch (e) {
      console.log('Error in fetching schedule call', e);
    } finally {
      setLoading(false);
    }
  };
  console.log('125', data);

  // Simple download function using Linking (Alternative)
  const downloadDocumentSimple = async (url, documentIndex) => {
    if (downloading) return;

    setDownloading(true);

    try {
      if (!url) {
        Alert.alert('Error', 'Document URL not found');
        setDownloading(false);
        return;
      }

      // Open URL in browser for download
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
        Alert.alert(
          'Download Started',
          'Document download has been started. Please check your Downloads folder or browser downloads.',
        );
      } else {
        Alert.alert('Error', 'Cannot open document URL');
      }
    } catch (error) {
      console.log('Download error:', error);
      Alert.alert('Error', 'Unable to download the document');
    } finally {
      setDownloading(false);
    }
  };

  // Function to download document
  const downloadDocument = async (url, documentIndex) => {
    if (downloading) return;

    setDownloading(true);

    try {
      // Check if URL is valid
      if (!url) {
        Alert.alert('Error', 'Document URL not found');
        setDownloading(false);
        return;
      }

      // Request permission for Android
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Storage permission is required to download files',
        );
        setDownloading(false);
        return;
      }

      // Extract file extension from URL
      const urlParts = url.split('.');
      const fileExtension =
        urlParts[urlParts.length - 1].split('?')[0] || 'pdf';

      // Generate filename with timestamp
      const timestamp = moment().format('YYYYMMDD_HHmmss');
      const fileName = `approved_document_${
        documentIndex + 1
      }_${timestamp}.${fileExtension}`;

      // Define download path
      const downloadDest = Platform.select({
        ios: `${RNFS.DocumentDirectoryPath}/${fileName}`,
        android: `${RNFS.DownloadDirectoryPath}/${fileName}`,
      });

      // Download options
      const options = {
        fromUrl: url,
        toFile: downloadDest,
        background: true,
        discretionary: true,
        progress: res => {
          // You can show progress here if needed
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log('Download progress:', progress.toFixed(2) + '%');
        },
      };

      // Start download
      const response = await RNFS.downloadFile(options).promise;

      if (response.statusCode === 200) {
        Alert.alert(
          'Download Complete',
          `Document downloaded successfully as ${fileName}`,
          [
            {
              text: 'Open',
              onPress: () => {
                // Open file with default app
                if (Platform.OS === 'android') {
                  Linking.openURL(`file://${downloadDest}`).catch(err => {
                    console.log('Error opening file:', err);
                    Alert.alert(
                      'Error',
                      'Cannot open file. Please check your Downloads folder.',
                    );
                  });
                } else {
                  // For iOS, you might want to use react-native-share or similar
                  Linking.openURL(downloadDest).catch(err => {
                    console.log('Error opening file:', err);
                  });
                }
              },
            },
            {text: 'OK'},
          ],
        );
      } else {
        throw new Error(
          'Download failed with status code: ' + response.statusCode,
        );
      }
    } catch (error) {
      console.log('Download error:', error);
      Alert.alert(
        'Download Failed',
        'Unable to download the document. Please try again or check your internet connection.',
      );
    } finally {
      setDownloading(false);
    }
  };

  // Get approved documents from statusLogs
  const getApprovedDocuments = () => {
    if (!data?.statusLogs || !Array.isArray(data.statusLogs)) {
      return [];
    }

    return data.statusLogs.filter(
      log => log.status === 'approved' && log.document,
    );
  };

  // const handleDocumentUpload = documentType => {
  //   setSelectedDocumentType(documentType);
  //   bottomSheetRef.current?.expand();
  // };

  // const handleSheetChanges = useCallback(index => {
  //   if (index === -1) {
  //     setSelectedDocumentType('');
  //   }
  // }, []);

  // const closeBottomSheet = () => {
  //   bottomSheetRef.current?.close();
  // };

  // const uploadDocumentToAPI = async (documentData, documentLabel) => {
  //   closeBottomSheet();
  //   try {
  //     setDocumentLoadingStates(prev => ({
  //       ...prev,
  //       [documentLabel]: true,
  //     }));

  //     const apiData = {
  //       documentName: documentLabel,
  //       document: documentData.base64,
  //     };
  //     console.log('Uploading document to API:', apiData);

  //     setDocumentLoadingStates(prev => ({
  //       ...prev,
  //       [documentLabel]: false,
  //     }));
  //   } catch (error) {
  //     console.log('Error uploading document:', error);
  //     setDocumentLoadingStates(prev => ({
  //       ...prev,
  //       [documentLabel]: false,
  //     }));
  //   }
  // };

  // const pickDocument = async () => {
  //   try {
  //     const result = await DocumentPicker.pickSingle({
  //       type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
  //       copyTo: 'documentDirectory',
  //     });

  //     const base64Data = await convertPdfToBase64(
  //       result.fileCopyUri || result.uri,
  //     );
  //     if (!base64Data) return;

  //     const documentData = {
  //       name: result.name,
  //       base64: base64Data,
  //     };

  //     setUploadedDocuments(prev => ({
  //       ...prev,
  //       [selectedDocumentType]: documentData,
  //     }));

  //     await uploadDocumentToAPI(documentData, selectedDocumentType);
  //   } catch (error) {
  //     if (!DocumentPicker.isCancel(error)) {
  //       console.log('DocumentPicker Error: ', error);
  //     }
  //   }
  // };

  // const pickImage = async () => {
  //   launchImageLibrary({mediaType: 'photo', quality: 0.8}, async response => {
  //     if (response.assets?.[0]) {
  //       const asset = response.assets[0];
  //       const base64Data = await convertToBase64(asset.uri);
  //       if (!base64Data) return;

  //       const imageData = {
  //         name: asset.fileName || 'image.jpg',
  //         base64: base64Data,
  //       };

  //       setUploadedDocuments(prev => ({
  //         ...prev,
  //         [selectedDocumentType]: imageData,
  //       }));

  //       await uploadDocumentToAPI(imageData, selectedDocumentType);
  //     }
  //     closeBottomSheet();
  //   });
  // };

  return (
    <Container showHeader={false}>
      {/* <GestureHandlerRootView style={{flex: 1}}> */}
        {loading ? (
          <ApplicationDetailSkeleton />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator
            contentContainerStyle={commonSty.pb100}>
            <View style={styles.imageWrapper}>
              <FastImage
                source={{uri: data?.visaDetail?.basicDetails?.coverImage[0]}}
                resizeMode={FastImage.resizeMode.cover}
                style={styles.mainImage}
              />
              <View style={styles.overlay} />
              <TouchableOpacity
                style={[
                  commonSty.mt15,
                  commonSty.ml10,
                  {
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
                onPress={() => navigation.navigate('History')}>
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color={COLORS.APP_WHITE}
                />
              </TouchableOpacity>
              <View
                style={[
                  {
                    position: 'absolute',
                    bottom: 0,
                    paddingHorizontal: 20,
                    paddingVertical: 50,
                  },
                ]}>
                <Typography
                  title={data?.visaDetail?.basicDetails?.countryName}
                  style={{
                    color: '#FFFFFF',
                    fontFamily: FONTS.INTER_BOLD,
                    fontSize: 24,
                  }}
                />

                <View
                  style={[
                    styles.statusView,
                    {
                      backgroundColor: applicationStatusBgColor[data?.status],
                    },
                  ]}>
                  <Text
                    style={[
                      styles.txtStatus,
                      {
                        color: applicationStatusTextColor[data?.status],
                      },
                    ]}>
                    {applicationStatusText[data?.status]}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.card, {marginTop: -30, padding: 16}]}>
              {/* Header */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 25,
                }}>
                <Typography
                  title="Application Details"
                  size={18}
                  font={FONTS.INTER_BOLD}
                />
                <Image
                  source={Images.list}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                    tintColor: COLORS.APP_PRIMARY_MAIN,
                  }}
                />
              </View>

              {[
                {
                  icon: vizaApplied,
                  label: 'Visa Applied',
                  value: moment(data?.createdAt).format('DD MMMM, YYYY'),
                  color: '#20B2AA',
                  bgcolor: '#20B2AA1A',
                },
                {
                  icon: vizaCategory,
                  label: 'Visa Category',
                  value: data?.visaCategory || '-',
                  color: '#0077BE',
                  bgcolor: '#0077BE1A',
                },
                {
                  icon: vizaType,
                  label: 'Visa Type',
                  value: data?.visaType || '-',
                  color: '#FF8C42',
                  bgcolor: '#FF8C421A',
                },
                {
                  icon: planeInApp,
                  label: 'Travel Date',
                  value: moment(data?.travelDate).format('DD MMMM, YYYY'),
                  color: '#FF6B6B',
                  bgcolor: '#FF6B6B1A',
                },
              ].map((item, idx, arr) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: idx === arr.length - 1 ? 0 : 14,
                    gap: 15,
                  }}>
                  {/* Icon with circle background */}
                  <View
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 20,
                      backgroundColor: item.bgcolor,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 8,
                    }}>
                    <Image
                      source={item.icon}
                      style={{
                        height: 18,
                        width: 18,
                        tintColor: item.color,
                        resizeMode: 'contain',
                      }}
                    />
                  </View>

                  {/* Texts */}
                  <View style={{gap: 5}}>
                    <Typography
                      title={item.label}
                      size={12}
                      font={FONTS.INTER_REGULAR}
                      color="#6B7280"
                    />
                    <Typography
                      title={item.value}
                      size={14}
                      font={FONTS.INTER_MEDIUM}
                      color="#111827"
                    />
                  </View>
                </View>
              ))}
            </View>

            <View style={[styles.card, {marginTop: 20, padding: 16}]}>
              {/* Header */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 25,
                }}>
                <Typography
                  title="Visa Information"
                  size={18}
                  font={FONTS.INTER_BOLD}
                />
                <Image
                  source={Images.info}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                    tintColor: COLORS.APP_PRIMARY_MAIN,
                  }}
                />
              </View>

              {[
                {
                  icon: viza,
                  label: 'Visa Entry',
                  value: data?.visaDetail?.visaDetails?.visaEntry,
                  color: '#22C55E',
                  bgcolor: '#22C55E1A',
                },
                {
                  icon: calender,
                  label: 'Validity Period',
                  value: data?.visaDetail?.visaDetails?.validityPeriod,
                  color: '#A855F7',
                  bgcolor: '#A855F71A',
                },
                {
                  icon: clock,
                  label: 'Length of Stay',
                  value: data?.visaDetail?.visaDetails?.lengthOfStay,
                  color: '#6366F1',
                  bgcolor: '#6366F11A',
                },
                {
                  icon: ProcessingTime,
                  label: 'Processing Days',
                  value: data?.visaDetail?.visaDetails?.visaProcessingDays,
                  color: '#EAB308',
                  bgcolor: '#EAB3081A',
                },
                {
                  icon: garanteeDate,
                  label: 'Guaranteed Date',
                  value: moment(
                    data?.visaDetail?.visaDetails?.visaGaurrentedOn,
                  ).format('DD MMMM, YYYY'),
                  color: '#20B2AA',
                  bgcolor: '#20B2AA1A',
                },
                {
                  icon: clock,
                  label: 'Visa Time',
                  value: data?.visaDetail?.visaDetails?.visaTime,
                  color: '#FF8C42',
                  bgcolor: '#FF8C421A',
                },
              ].map((item, idx, arr) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: idx === arr.length - 1 ? 0 : 14,
                    gap: 15,
                  }}>
                  {/* Icon with circle background */}
                  <View
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 20,
                      backgroundColor: item.bgcolor,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 8,
                    }}>
                    <Image
                      source={item.icon}
                      style={{
                        height: 18,
                        width: 18,
                        tintColor: item.color,
                        resizeMode: 'contain',
                      }}
                    />
                  </View>

                  {/* Texts */}
                  <View style={{gap: 5}}>
                    <Typography
                      title={item.label}
                      size={12}
                      font={FONTS.INTER_REGULAR}
                      color="#6B7280"
                    />
                    <Typography
                      title={item.value}
                      size={14}
                      font={FONTS.INTER_MEDIUM}
                      color="#111827"
                    />
                  </View>
                </View>
              ))}
            </View>
            {/* Approved Documents Section */}
            {getApprovedDocuments().length > 0 && (
              <View style={[styles.card, {marginTop: 20}]}>
                <Typography
                  title={`Approved Documents`}
                  size={16}
                  font={FONTS.INTER_MEDIUM}
                  mb={10}
                />
                <View style={styles.divider} />
                {getApprovedDocuments().map((docLog, index) => (
                  <View key={index} style={styles.documentContainer}>
                    <View style={styles.documentHeader}>
                      <Typography
                        title={`Document ${index + 1}`}
                        size={14}
                        font={FONTS.INTER_MEDIUM}
                      />
                      <Typography
                        title={`Approved on: ${moment(docLog.changedAt).format(
                          'DD MMM, YYYY',
                        )}`}
                        size={10}
                        color={COLORS.APP_GRAY}
                      />
                    </View>

                    {docLog.remarks && (
                      <Typography
                        title={`Remarks: ${docLog.remarks}`}
                        size={12}
                        color={COLORS.APP_GRAY}
                        mt={5}
                      />
                    )}

                    <TouchableOpacity
                      style={[
                        styles.documentButton,
                        downloading && styles.documentButtonDisabled,
                      ]}
                      onPress={() =>
                        downloadDocumentSimple(docLog.document, index)
                      }
                      disabled={downloading}>
                      <Icon
                        icon="Ionicons"
                        name="document"
                        size={24}
                        color={
                          downloading
                            ? COLORS.APP_GRAY
                            : COLORS.APP_PRIMARY_MAIN
                        }
                      />
                      <Typography
                        title={'View Document'}
                        size={12}
                        color={
                          downloading
                            ? COLORS.APP_GRAY
                            : COLORS.APP_PRIMARY_MAIN
                        }
                        ml={8}
                      />
                    </TouchableOpacity>

                    {index < getApprovedDocuments().length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                ))}
              </View>
            )}

            <ApplicationProgressBar
              statusLogs={data?.statusLogs}
              currentStatus={data?.status}
            />
            {data?.applicants?.length > 0 && (
              <View style={[styles.card, {marginTop: 20}]}>
                {/* Header */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                  }}>
                  <Typography
                    title="Applicants"
                    size={18}
                    font={FONTS.INTER_BOLD}
                  />
                  <Image
                    source={Images.applicants}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                      tintColor: COLORS.APP_PRIMARY_MAIN,
                    }}
                  />
                </View>

                {data?.applicants?.map((ele, index) => {
                  const details = ele?.childUser?.details;

                  return (
                    <View key={index} style={{marginBottom: 16}}>
                      {/* Row: Profile */}
                      <View style={[styles.row, {alignItems: 'center'}]}>
                        <FastImage
                          source={{uri: ele?.childUser?.photo}}
                          style={{
                            height: 40,
                            width: 40,
                            borderRadius: 20,
                            marginRight: 10,
                          }}
                          resizeMode="cover"
                        />
                        <View style={{flex: 1}}>
                          <Text style={styles.label}>
                            {details?.firstName} {details?.lastName}
                          </Text>
                          <Text
                            style={[
                              styles.value,
                              {fontSize: 12, color: COLORS.APP_GRAY},
                            ]}>
                            {details?.gender}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.divider} />

                      <Text
                        style={[
                          styles.label,
                          {marginTop: 10, marginBottom: 6},
                        ]}>
                        Passport Photos
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 10,
                          marginBottom: 15,
                        }}>
                        <FastImage
                          source={{uri: ele?.childUser?.passport?.front}}
                          style={styles.passportImage}
                          resizeMode="cover"
                        />
                        <FastImage
                          source={{uri: ele?.childUser?.passport?.back}}
                          style={styles.passportImage}
                          resizeMode="cover"
                        />
                      </View>
                      {/* Passport Info */}
                      <View style={styles.row}>
                        <Text style={styles.label}>Passport No</Text>
                        <Text style={styles.value}>
                          {details?.passportNumber}
                        </Text>
                      </View>

                      <View style={styles.row}>
                        <Text style={styles.label}>Issued From</Text>
                        <Text style={styles.value}>
                          {details?.passportFrom}
                        </Text>
                      </View>

                      <View style={styles.row}>
                        <Text style={styles.label}>Issued On</Text>
                        <Text style={styles.value}>
                          {moment(
                            details?.passportIssuedOn,
                            'DD/MM/YYYY',
                          ).format('DD MMM, YYYY')}
                        </Text>
                      </View>

                      <View style={styles.row}>
                        <Text style={styles.label}>Valid Till</Text>
                        <Text style={styles.value}>
                          {moment(
                            details?.passportValidUntil,
                            'DD/MM/YYYY',
                          ).format('DD MMM, YYYY')}
                        </Text>
                      </View>

                      <View style={styles.row}>
                        <Text style={styles.label}>Birth Date</Text>
                        <Text style={styles.value}>
                          {moment(details?.dob, 'DD/MM/YYYY').format(
                            'DD MMM, YYYY',
                          )}
                        </Text>
                      </View>

                      <View style={styles.row}>
                        <Text style={styles.label}>Place of Birth</Text>
                        <Text style={styles.value}>
                          {details?.placeOfBirth}
                        </Text>
                      </View>

                      {/* Passport Photos */}

                      {/* Documents */}
                      {ele?.childUser?.documents?.length > 0 && (
                        <>
                          <Text
                            style={[
                              styles.label,
                              {marginTop: 12, marginBottom: 6},
                            ]}>
                            Required Documents
                          </Text>
                          <FlatList
                            data={ele?.childUser?.documents}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item}) => (
                              <FastImage
                                source={{uri: item?.documentUrl}}
                                style={styles.documentImage}
                              />
                            )}
                            keyExtractor={(_, i) => i.toString()}
                          />
                        </>
                      )}

                      {/* {ele?.childUser?.missingDocuments?.length > 0 && (
                        <>
                          <Text
                            style={[
                              styles.label,
                              {marginTop: 12, marginBottom: 6},
                            ]}>
                            Pending Documents
                          </Text>

                          {ele?.childUser?.missingDocuments?.map(
                            (ele, index) => {
                              const isThisDocumentLoading =
                                documentLoadingStates[ele.label];
                              return (
                                <View>
                                  <View>
                                    <Text style={styles.txtCardHeading}>
                                      {index + 1}. {ele.label}
                                    </Text>
                                    <View style={styles.uploadCard}>
                                      <FontAwesome
                                        name="cloud-upload"
                                        size={28}
                                        color={COLORS.APP_GRAY}
                                      />
                                      <Text style={styles.txtLabel}>
                                        Tap to upload your {ele.label}
                                      </Text>
                                      <Text style={styles.txtSubLabel}>
                                        PDF, JPG, PNG up to 10MB
                                      </Text>
                                      <CommonButton
                                        leftIcon={Images.plus_icon}
                                        style={{marginTop: 16, width: '70%'}}
                                        btnText={'Upload Document'}
                                        variant={'contained'}
                                        onPress={() =>
                                          handleDocumentUpload(ele.label)
                                        }
                                        isLoading={isThisDocumentLoading}
                                        btnTextStyle={{fontSize: 14}}
                                      />
                                    </View>
                                  </View>
                                </View>
                              );
                            },
                          )}
                         
                        </>
                      )} */}
                    </View>
                  );
                })}
              </View>
            )}

            {/* Payment Details Card */}
            {data?.paymentDetails?.length > 0 && (
              <View style={[styles.card, {marginTop: 20}]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                  }}>
                  <Typography
                    title="Payment Details"
                    size={18}
                    font={FONTS.INTER_BOLD}
                  />
                  <Image
                    source={Images.payment_details}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                      tintColor: COLORS.APP_PRIMARY_MAIN,
                    }}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Visa Fee</Text>
                  <Text style={styles.value}>
                    ₹
                    {parseFloat(
                      data?.visaDetail?.visaDetails?.visaFee || 0,
                    ).toFixed(2)}
                  </Text>
                </View>

                {/* Platform Fee */}
                <View style={styles.row}>
                  <Text style={styles.label}>Platform Fee</Text>
                  <Text style={styles.value}>
                    ₹
                    {parseFloat(
                      data?.visaDetail?.visaDetails?.vizayardFee || 0,
                    ).toFixed(2)}
                  </Text>
                </View>

                {/* Total Travellers */}
                <View style={styles.row}>
                  <Text style={styles.label}>Total Travellers</Text>
                  <Text style={styles.value}>{data?.applicants?.length}</Text>
                </View>

                <View style={styles.divider} />

                {/* Calculated Amount */}
                <View style={styles.row}>
                  <Text style={styles.label}>Calculated Amount</Text>
                  <Text style={styles.highlightValue}>
                    {data?.applicants?.length} x ₹
                    {(
                      parseFloat(data?.visaDetail?.visaDetails?.visaFee || 0) +
                      parseFloat(
                        data?.visaDetail?.visaDetails?.vizayardFee || 0,
                      )
                    ).toFixed(2)}
                  </Text>
                </View>

                {/* Total Amount */}
                <View style={[styles.row, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalValue}>
                    ₹
                    {(
                      (parseFloat(data?.visaDetail?.visaDetails?.visaFee || 0) +
                        parseFloat(
                          data?.visaDetail?.visaDetails?.vizayardFee || 0,
                        )) *
                      (data?.applicants?.length || 0)
                    ).toFixed(2)}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        )}
        {/* <CommonBottomSheet
          bottomSheetRef={bottomSheetRef}
          handleSheetChanges={handleSheetChanges}
          onPressPDF={pickDocument}
          onPressImage={pickImage}
          heading={'Upload Document'}
          descriptions={'Choose document'}
        /> */}
      {/* </GestureHandlerRootView> */}
    </Container>
  );
};

export default ApplicationDetail;

const styles = StyleSheet.create({
  detailContainer: {
    borderRadius: moderateScale(10),
    borderWidth: 1,
    padding: moderateScale(10),
    borderColor: COLORS.APP_PRIMARY_MAIN,
    ...commonSty.mh15,
    ...commonSty.mt10,
  },
  imageWrapper: {
    position: 'relative',
    height: verticalScale(200),
    width: '100%',
  },
  mainImage: {
    height: verticalScale(200),
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 0,
  },

  card: {
    backgroundColor: COLORS.APP_WHITE,
    elevation: 2, // Android shadow
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    marginHorizontal: moderateScale(15),
    marginTop: 20,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  divider: {
    backgroundColor: '#E6E6E6',
    height: 1,
    marginVertical: 10,
  },
  statusView: {
    height: 30,
    justifyContent: 'center',
    borderRadius: 50,
    marginTop: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  txtStatus: {
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: 12,
  },
  txtTravellerName: {
    fontSize: 14,
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_REGULAR,
  },
  txtPassportNumber: {
    color: COLORS.APP_COMMON_GRAY,
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: 16,
  },
  txtTravellerDetails: {
    fontSize: 16,
    fontFamily: FONTS.INTER_SEMIBOLD,
    color: COLORS.APP_COMMON_BLACK,
  },
  // Updated styles for document download
  documentContainer: {
    marginVertical: 5,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.APP_PRIMARY_MAIN,
    borderRadius: 8,
    backgroundColor: COLORS.APP_WHITE,
  },
  documentButtonDisabled: {
    opacity: 0.6,
    borderColor: COLORS.APP_GRAY,
  },
  feeContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    color: '#6B7280', // grey-500
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827', // dark
  },
  highlightValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.APP_PRIMARY_MAIN, // blue-600
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalRow: {
    marginTop: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.APP_PRIMARY_MAIN, // green accent
  },
  passportImage: {
    height: 70,
    width: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.APP_GRAY_100,
  },
  documentImage: {
    height: 70,
    width: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.APP_GRAY_100,
    marginRight: 10,
  },

  pendingCard: {
    backgroundColor: COLORS.APP_WHITE,
    borderWidth: 1,
    borderColor: COLORS.APP_BORDER,
    marginTop: 8,
    padding: 8,
    borderRadius: 10,
  },
  txtCardHeading: {
    fontSize: 14,
    fontFamily: FONTS.INTER_SEMIBOLD,
    color: COLORS.APP_BLACK,
  },
  uploadCard: {
    borderWidth: 2,
    borderColor: COLORS.APP_BORDER,
    borderStyle: 'dotted',
    borderRadius: 20,
    height: 180,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtLabel: {
    fontSize: 12,
    fontFamily: FONTS.INTER_REGULAR,
    color: '#4B5563',
    marginTop: 5,
    textAlign: 'center',
  },
  txtSubLabel: {
    fontSize: 12,
    fontFamily: FONTS.INTER_REGULAR,
    color: '#9CA3AF',
    marginTop: 5,
  },
});

















import React, {useContext, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Linking,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import styles from './style';
import {COLORS} from '../../config/colors';
import USER from '../../../assets/images/explore/user.png';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../../context/AuthContext';
import {showPopupWithOkAndCancel} from '../../utils';
import {CustomConfirmModal, Icon} from '../../components';
//relative path imports
import DOCUMENTS from '../../../assets/images/document.png';
import PERSONS from '../../../assets/images/persons.png';
import PROCESS from '../../../assets/images/process.png';
import HELP from '../../../assets/images/help.png';
import LOGOUT from '../../../assets/images/logout.png';
import PROFILE from '../../../assets/images/profile.png';
import BottomDrawer from '../../components/BottomDrawer';
import USER_PROFILE from '../../../assets/images/bottom/profile.png';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {convertToBase64} from '../../utils/helper';
import {addUserToken} from '../../redux/MainSlice';
import Toast from 'react-native-toast-message';
import {updateUser} from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import HISTORY from '../../../assets/images/bottom/history.png';

const data = [
  {
    icon: USER_PROFILE,
    title: 'My Profile',
  },
  {
    icon: PERSONS,
    title: 'Persona',
  },
  {
    icon: HISTORY,
    title: 'History',
  },
  {
    icon: HELP,
    title: 'Help',
  },
];

const Profile = ({navigation}) => {
  const [bottomDrawerVisible, setBottomDrawerVisible] = useState(false);
  const {logout, user, login} = useContext(AuthContext);
  const [logoutModal, setLogoutModal] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log('user', user);
  const dispatch = useDispatch();

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to camera to capture photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
          return true;
        } else {
          console.log('Camera permission denied');
          Alert.alert(
            'Permission Required',
            'Camera permission is required to capture photos. Please grant permission in app settings.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Settings',
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ],
          );
          return false;
        }
      } catch (err) {
        console.warn('Camera permission error:', err);
        return false;
      }
    } else {
      return true;
    }
  };

  // Function to calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const documents = [
      user?.userImageUrl,
      user?.incomeTaxReturn,
      user?.passportFront,
      user?.passportBack,
      user?.adharCard,
      user?.panCard,
    ];

    const completedDocuments = documents.filter(
      doc => doc && doc !== '',
    ).length;
    return (completedDocuments / 6) * 100;
  };

  // Circular Progress Bar Component
  const CircularProgressBar = ({percentage, size = 160, strokeWidth = 3}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <Svg width={size} height={size} style={styles.circularProgress}>
        {/* Background Circle */}
        <Circle
          stroke={COLORS.APP_LIGHT_GRAY || '#E5E5E5'}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <Circle
          stroke={COLORS.APP_PRIMARY || '#007AFF'}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    );
  };

  const handlePhotoSelection = async response => {
    if (response.didCancel) {
      console.log('User cancelled photo selection');
      return;
    }

    if (response.errorMessage) {
      console.log('ImagePicker Error: ', response.errorMessage);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
      return;
    }

    if (response.assets && response.assets.length > 0) {
      const selectedImage = response.assets[0];
      await handlePhotoTaken(selectedImage.uri);
    } else {
      console.log('No photo selected.');
    }
  };

  const openCamera = async () => {
    setBottomDrawerVisible(false);

    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.8,
        maxWidth: 1000,
        maxHeight: 1000,
        cameraType: 'front',
      },
      handlePhotoSelection,
    );
  };

  const openGallery = () => {
    setBottomDrawerVisible(false);
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.8,
        maxWidth: 1000,
        maxHeight: 1000,
      },
      handlePhotoSelection,
    );
  };

  const handlePhotoTaken = async fileUri => {
    console.log('Base64 Data:', fileUri);
    try {
      setIsLoading(true);

      let imageBase64 = fileUri;

      if (!imageBase64.startsWith('data:')) {
        imageBase64 = await convertToBase64(imageBase64);
      } else {
        imageBase64 = fileUri;
      }

      const obj = {
        phoneNumber: user?.phoneNumber || '',
        userPhoto: imageBase64,
      };

      if (user?.email) {
        obj.email = user?.email;
      }

      if (user?.city) {
        obj.city = user?.city;
      }

      if (user?.alternateNo) {
        obj.alternateNo = user?.alternateNo;
      }

      const res = await updateUser(user?.id, obj, user?.token);

      if (res?.data?.status) {
        const updatedUserData = {
          ...user,
          userImageUrl: res?.data?.data?.userImageUrl,
        };
        setPhotoTaken(res?.data?.data?.userImageUrl);
        login(updatedUserData);
        await AsyncStorage.setItem(
          'userSession',
          JSON.stringify(updatedUserData),
        );
        if (updatedUserData.token) {
          dispatch(addUserToken(updatedUserData.token));
        }
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Profile picture updated successfully',
        });
      }
    } catch (error) {
      console.log('Update User API Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update profile picture',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ProfileImage = () => {
    const [imageLoading, setImageLoading] = useState(false);
    const completionPercentage = calculateProfileCompletion();

    if (isLoading) {
      return (
        <View style={styles.profileImageSection}>
          <View style={styles.circularProgressContainer}>
            <CircularProgressBar percentage={completionPercentage} />
            <View style={styles.profileImageWrapper}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.APP_PRIMARY} />
              </View>
            </View>
          </View>
          <Text style={styles.progressPercentageText}>
            {Math.round(completionPercentage)}% Complete
          </Text>
        </View>
      );
    }

    const imageSource = user?.userImageUrl || photoTaken;

    return (
      <View style={styles.profileImageSection}>
        <View style={styles.circularProgressContainer}>
          <CircularProgressBar percentage={completionPercentage} />
          <View style={styles.profileImageWrapper}>
            {imageSource ? (
              <>
                <FastImage
                  source={{uri: imageSource}}
                  style={styles.profilePicture}
                  onLoadStart={() => setImageLoading(true)}
                  onLoadEnd={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
                {imageLoading && (
                  <View style={styles.imageLoadingOverlay}>
                    <ActivityIndicator
                      size="large"
                      color={COLORS.APP_PRIMARY}
                    />
                  </View>
                )}
              </>
            ) : (
              <View style={styles.defaultProfileContainer}>
                <Image source={PROFILE} style={styles.defaultProfileImage} />
              </View>
            )}
          </View>
        </View>
        <Text style={styles.progressPercentageText}>
          {Math.round(completionPercentage)}% Profile Complete
        </Text>
      </View>
    );
  };

  const renderItem = (item, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => {
        if (item.title === 'My Profile') {
          navigation.navigate('MyProfile');
        } else if (item.title === 'Persona') {
          navigation.navigate('Personas');
        } else if (item.title === 'History') {
          navigation.navigate('History');
        }else if(item.title === "Help"){
          navigation.navigate("Help");
        }
      }}>
      <View style={styles.menuItem}>
        <View style={styles.menuItemContent}>
          <Image source={item.icon} style={styles.menuIcon} />
          <Text style={styles.txtItemTitle}>{item.title}</Text>
        </View>
        {item.title !== 'Log out' && (
          <Entypo name="chevron-right" size={24} color={COLORS.APP_GRAY} />
        )}
      </View>
      {item.title === 'Setting' && (
        <View style={[styles.horizontalLine, {marginBottom: 10}]} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header} />

        <CustomConfirmModal
          open={logoutModal}
          title={'Vizayard'}
          submitLabel="Okay"
          message={'Are you sure you want to log out?'}
          cancelLabel="Cancel"
          handleConfirm={logout}
          handleCancel={() => setLogoutModal(false)}
        />

        <View style={styles.profileSection}>
          <View style={styles.profileContainer}>
            <ProfileImage />
            <TouchableOpacity
              style={styles.editView}
              onPress={() => setBottomDrawerVisible(true)}>
              <MaterialIcons name="edit" size={16} color={COLORS.APP_WHITE} />
            </TouchableOpacity>
          </View>

          {user?.firstName && (
            <Text style={styles.txtProfileName}>
              {`${user?.firstName} ${user?.lastName}`}
            </Text>
          )}
        </View>

        <View style={[styles.horizontalLine, {marginTop: 30}]} />

        <View style={{marginVertical: 10}}>
          {data.map((item, index) => renderItem(item, index))}
        </View>

        <View style={styles.horizontalLine} />

        <TouchableOpacity
          style={{marginBottom: 80}}
          onPress={() => setLogoutModal(true)}>
          <View style={styles.logoutItem}>
            <View style={styles.menuItemContent}>
              <Image source={LOGOUT} style={styles.menuIcon} />
              <Text style={styles.txtItemTitle}>Logout</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <BottomDrawer
        visible={bottomDrawerVisible}
        onClose={() => setBottomDrawerVisible(false)}
        height={180}>
        <View style={styles.drawerContainer}>
          <Text style={styles.drawerTitle}>Update Profile Picture</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={openCamera}>
              <Entypo name="camera" size={24} color={COLORS.APP_PRIMARY_MAIN} />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={openGallery}>
              <MaterialIcons
                name="photo-library"
                size={24}
                color={COLORS.APP_PRIMARY_MAIN}
              />
              <Text style={styles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomDrawer>
    </SafeAreaView>
  );
};

export default Profile;
