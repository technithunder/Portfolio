import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import {createChildUser, getSingleVisaApplication} from '../../api';
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {convertPdfToBase64, convertToBase64} from '../../utils/helper';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import CommonBottomSheet from '../../components/BottomSheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CommonButton from '../../components/CommonButton';
import {AuthContext} from '../../context/AuthContext';

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
  const {user} = useContext(AuthContext);
  const route = useRoute<any>().params;
  const id = route?.data;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const bottomSheetRef = useRef(null);
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [documentLoadingStates, setDocumentLoadingStates] = useState({});
  const [childUserId, setChildUserId] = useState('');
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
  // console.log('125', data);

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
  // const downloadDocument = async (url, documentIndex) => {
  //   if (downloading) return;

  //   setDownloading(true);

  //   try {
  //     // Check if URL is valid
  //     if (!url) {
  //       Alert.alert('Error', 'Document URL not found');
  //       setDownloading(false);
  //       return;
  //     }

  //     // Request permission for Android
  //     const hasPermission = await requestStoragePermission();
  //     if (!hasPermission) {
  //       Alert.alert(
  //         'Permission Required',
  //         'Storage permission is required to download files',
  //       );
  //       setDownloading(false);
  //       return;
  //     }

  //     // Extract file extension from URL
  //     const urlParts = url.split('.');
  //     const fileExtension =
  //       urlParts[urlParts.length - 1].split('?')[0] || 'pdf';

  //     // Generate filename with timestamp
  //     const timestamp = moment().format('YYYYMMDD_HHmmss');
  //     const fileName = `approved_document_${
  //       documentIndex + 1
  //     }_${timestamp}.${fileExtension}`;

  //     // Define download path
  //     const downloadDest = Platform.select({
  //       ios: `${RNFS.DocumentDirectoryPath}/${fileName}`,
  //       android: `${RNFS.DownloadDirectoryPath}/${fileName}`,
  //     });

  //     // Download options
  //     const options = {
  //       fromUrl: url,
  //       toFile: downloadDest,
  //       background: true,
  //       discretionary: true,
  //       progress: res => {
  //         // You can show progress here if needed
  //         const progress = (res.bytesWritten / res.contentLength) * 100;
  //         console.log('Download progress:', progress.toFixed(2) + '%');
  //       },
  //     };

  //     // Start download
  //     const response = await RNFS.downloadFile(options).promise;

  //     if (response.statusCode === 200) {
  //       Alert.alert(
  //         'Download Complete',
  //         `Document downloaded successfully as ${fileName}`,
  //         [
  //           {
  //             text: 'Open',
  //             onPress: () => {
  //               // Open file with default app
  //               if (Platform.OS === 'android') {
  //                 Linking.openURL(`file://${downloadDest}`).catch(err => {
  //                   console.log('Error opening file:', err);
  //                   Alert.alert(
  //                     'Error',
  //                     'Cannot open file. Please check your Downloads folder.',
  //                   );
  //                 });
  //               } else {
  //                 // For iOS, you might want to use react-native-share or similar
  //                 Linking.openURL(downloadDest).catch(err => {
  //                   console.log('Error opening file:', err);
  //                 });
  //               }
  //             },
  //           },
  //           {text: 'OK'},
  //         ],
  //       );
  //     } else {
  //       throw new Error(
  //         'Download failed with status code: ' + response.statusCode,
  //       );
  //     }
  //   } catch (error) {
  //     console.log('Download error:', error);
  //     Alert.alert(
  //       'Download Failed',
  //       'Unable to download the document. Please try again or check your internet connection.',
  //     );
  //   } finally {
  //     setDownloading(false);
  //   }
  // };

  // Get approved documents from statusLogs
  const getApprovedDocuments = () => {
    if (!data?.statusLogs || !Array.isArray(data.statusLogs)) {
      return [];
    }

    return data.statusLogs.filter(
      log => log.status === 'approved' && log.document,
    );
  };

  const handleDocumentUpload = documentType => {
    setSelectedDocumentType(documentType);
    bottomSheetRef.current?.expand();
  };

  const handleSheetChanges = useCallback(index => {
    if (index === -1) {
      setSelectedDocumentType('');
    }
  }, []);

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const uploadDocumentToAPI = async (documentData, documentLabel) => {
    closeBottomSheet();
    try {
      setDocumentLoadingStates(prev => ({
        ...prev,
        [documentLabel]: true,
      }));

      // const apiData = {
      //   documentName: documentLabel,
      //   document: documentData.base64,
      // };
      // console.log('Uploading document to API:', apiData);

      const obj = {
        step: 4,
        parentUserId: user?.id,
        documentName: documentLabel,
        document: documentData.base64,
        visaId: data?.visaId,
        id: childUserId,
      };
      const response = await createChildUser(obj);

      if (response?.data?.status) {
        fetchSingleVisaApplication();
        setChildUserId('');
      }

      setDocumentLoadingStates(prev => ({
        ...prev,
        [documentLabel]: false,
      }));
    } catch (error) {
      setDocumentLoadingStates(prev => ({
        ...prev,
        [documentLabel]: false,
      }));
      setChildUserId('');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        copyTo: 'documentDirectory',
      });

      const base64Data = await convertPdfToBase64(
        result.fileCopyUri || result.uri,
      );
      if (!base64Data) return;

      const documentData = {
        name: result.name,
        base64: base64Data,
      };

      setUploadedDocuments(prev => ({
        ...prev,
        [selectedDocumentType]: documentData,
      }));

      await uploadDocumentToAPI(documentData, selectedDocumentType);
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log('DocumentPicker Error: ', error);
      }
    }
  };

  const pickImage = async () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.8}, async response => {
      if (response.assets?.[0]) {
        const asset = response.assets[0];
        const base64Data = await convertToBase64(asset.uri);
        if (!base64Data) return;

        const imageData = {
          name: asset.fileName || 'image.jpg',
          base64: base64Data,
        };

        setUploadedDocuments(prev => ({
          ...prev,
          [selectedDocumentType]: imageData,
        }));

        await uploadDocumentToAPI(imageData, selectedDocumentType);
      }
      closeBottomSheet();
    });
  };

  console.log('data', data);

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: 'white'}}>
      <Container showHeader={false}>
        {loading ? (
          <ApplicationDetailSkeleton />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
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

            {/* Application Details Card */}
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

              {/* Row Template */}
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

            {/* Visa Information Card */}
            {/* <View style={[styles.card, {marginTop: 20}]}>
            <Typography
              title={`Visa Information`}
              size={16}
              font={FONTS.INTER_MEDIUM}
              mb={10}
            />
            <View style={styles.divider} />
            <Typography
              title={`Visa Entry : ${data?.visaDetail?.visaDetails?.visaEntry}`}
              size={12}
              mv={2}
            />
            <Typography
              title={`Visa Validity Period : ${data?.visaDetail?.visaDetails?.validityPeriod}`}
              size={12}
              mv={2}
            />
            <Typography
              title={`Length of stay : ${data?.visaDetail?.visaDetails?.lengthOfStay}`}
              size={12}
              mv={2}
            />
            <Typography
              title={`Visa processing days : ${data?.visaDetail?.visaDetails?.visaProcessingDays} days`}
              size={12}
              mv={2}
            />
            <Typography
              title={`Visa Gaurrented On : ${moment
                .utc(data?.visaDetail?.visaDetails?.visaGaurrentedOn)
                .format('DD MMM, YYYY')}`}
              size={12}
              mv={2}
            />
            <Typography
              title={`Visa Time : ${moment(
                data?.visaDetail?.visaDetails?.visaTime,
                'HH:mm',
              ).format('hh:mm A')}`}
              size={12}
              mv={2}
            />
          </View> */}

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

              {/* Row Template */}
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

                {/* <Typography
                title={`Payment Details`}
                size={18}
                font={FONTS.INTER_BOLD}
                mb={10}
              /> */}

                {/* Visa Fee */}
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

            {/* Applicants Section */}
            {/* {data?.applicants?.length > 0 && (
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
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
                return (
                  <View key={index} style={[{marginTop: 10}]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 10,
                      }}>
                      <FastImage
                        source={{
                          uri: ele?.childUser?.photo,
                        }}
                        style={{
                          height: moderateScale(40),
                          width: moderateScale(40),
                          borderRadius: 50,
                        }}
                        resizeMode="cover"
                      />
                      <View>
                        <Typography
                          title={`${ele?.childUser?.details?.firstName} ${ele?.childUser?.details?.lastName}`}
                          size={14}
                        />
                        <Typography
                          title={ele?.childUser?.details?.gender}
                          size={10}
                          color={COLORS.APP_GRAY}
                        />
                      </View>
                    </View>

                    <View style={styles.divider} />
                    <Typography title={`Passport Photo:`} size={12} />
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                      }}>
                      <FastImage
                        source={{uri: ele?.childUser?.passport?.front}}
                        style={{
                          height: moderateScale(70),
                          width: moderateScale(70),
                          borderRadius: 10,
                          marginTop: 10,
                          borderWidth: 1,
                          borderColor: COLORS.APP_GRAY_100,
                        }}
                        resizeMode="cover"
                      />
                      <FastImage
                        source={{uri: ele?.childUser?.passport?.back}}
                        style={{
                          height: moderateScale(70),
                          width: moderateScale(70),
                          borderRadius: 10,
                          marginTop: 10,
                          borderWidth: 1,
                          borderColor: COLORS.APP_GRAY_100,
                        }}
                        resizeMode="cover"
                      />
                    </View>
                    <Typography
                      title={`Passport Number: ${ele?.childUser?.details?.passportNumber}`}
                      size={12}
                      mt={5}
                    />
                    <Typography
                      title={`Passport From: ${ele?.childUser?.details?.passportFrom}`}
                      size={12}
                      mt={5}
                    />
                    <Typography
                      title={`Passport Issued On: ${moment(
                        ele?.childUser?.details?.passportIssuedOn,
                        'DD/MM/YYYY',
                      ).format('DD MMM, YYYY')}`}
                      size={12}
                      mt={5}
                    />
                    <Typography
                      title={`Passport Valid: ${moment(
                        ele?.childUser?.details?.passportValidUntil,
                        'DD/MM/YYYY',
                      ).format('DD MMM, YYYY')}`}
                      size={12}
                      mt={5}
                    />
                    <Typography
                      title={`Birth Date: ${moment(
                        ele?.childUser?.details?.dob,
                        'DD/MM/YYYY',
                      ).format('DD MMM, YYYY')}`}
                      size={12}
                      mt={5}
                    />
                    <Typography
                      title={`Place of Birth: ${ele?.childUser?.details?.placeOfBirth}`}
                      size={12}
                      mt={5}
                    />

                    {ele?.childUser?.documents?.length > 0 && (
                      <View>
                        <Typography
                          title={`Require Documents :`}
                          size={12}
                          mt={5}
                        />
                        <FlatList
                          data={ele?.childUser?.documents}
                          horizontal
                          renderItem={({item, index}) => {
                            return (
                              <TouchableOpacity
                                style={{
                                  marginTop: 10,
                                  marginRight: 10,
                                  flexDirection: 'row',
                                  borderWidth: 1,
                                  borderColor: COLORS.APP_GRAY_100,
                                  borderRadius: 10,
                                }}>
                                <FastImage
                                  source={{uri: item?.documentUrl}}
                                  style={{
                                    height: moderateScale(70),
                                    width: moderateScale(70),
                                    borderRadius: 10,
                                  }}
                                  resizeMode="cover"
                                />
                              </TouchableOpacity>
                            );
                          }}
                        />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )} */}

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

                      {ele?.childUser?.missingDocuments?.length > 0 && (
                        <>
                          <Text
                            style={[
                              styles.label,
                              {marginTop: 12, marginBottom: 6},
                            ]}>
                            Pending Documents
                          </Text>

                          {ele?.childUser?.missingDocuments?.map(
                            (item, index) => {
                              const isThisDocumentLoading =
                                documentLoadingStates[item.label];
                              return (
                                <View>
                                  <View>
                                    <Text style={styles.txtCardHeading}>
                                      {index + 1}. {item.label}
                                    </Text>
                                    <View style={styles.uploadCard}>
                                      <FontAwesome
                                        name="cloud-upload"
                                        size={28}
                                        color={COLORS.APP_GRAY}
                                      />
                                      <Text style={styles.txtLabel}>
                                        Tap to upload your {item.label}
                                      </Text>
                                      <Text style={styles.txtSubLabel}>
                                        PDF, JPG, PNG up to 10MB
                                      </Text>
                                      <CommonButton
                                        leftIcon={Images.plus_icon}
                                        style={{marginTop: 16, width: '70%'}}
                                        btnText={'Upload Document'}
                                        variant={'contained'}
                                        onPress={() => {
                                          handleDocumentUpload(item.label);
                                          setChildUserId(ele?.childUser?.id);
                                        }}
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
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            <ApplicationProgressBar
              statusLogs={data?.statusLogs}
              currentStatus={data?.status}
            />
          </ScrollView>
        )}
      </Container>
      <CommonBottomSheet
        bottomSheetRef={bottomSheetRef}
        handleSheetChanges={handleSheetChanges}
        onPressPDF={pickDocument}
        onPressImage={pickImage}
        heading={'Upload Document'}
        descriptions={'Choose document'}
      />
    </GestureHandlerRootView>
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
