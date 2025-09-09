import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useRef, useMemo, useCallback} from 'react';
import {COLORS} from '../../../config/colors';
import {FONTS} from '../../../config/font';
import {Button, Icon, Typography} from '../../../components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DocumentPicker from 'react-native-document-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {convertPdfToBase64, convertToBase64} from '../../../utils/helper';
import CommonBottomSheet from '../../../components/BottomSheet';
import PDF_LOGO from '../../../../assets/images/pdf.png';
import {Images} from '../../../config';
import CommonButton from '../../../components/CommonButton';

const AdditionalDocuments = ({
  additionalDocuments,
  onSubmit,
  submitLoading,
  stepInfo,
  onPressConfirmBtn,
  isLoadingModal,
  // uploadedDocumentsFromAPI = [] // Add this prop to receive existing documents
}) => {
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [documentLoadingStates, setDocumentLoadingStates] = useState({});

  const bottomSheetRef = useRef(null);

  console.log('AdditionalDocuments', additionalDocuments);
  console.log('Uploaded Documents from API:', stepInfo);

  const groupedDocuments = useMemo(() => {
    const grouped = {};
    stepInfo?.forEach((doc, index) => {
      if (!grouped[doc.documentName]) {
        grouped[doc.documentName] = [];
      }
      grouped[doc.documentName].push({
        ...doc,
        id: index,
      });
    });
    return grouped;
  }, [stepInfo]);

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

      const apiData = {
        documentName: documentLabel,
        document: documentData.base64,
      };
      console.log('Uploading document to API:', apiData);

      await onSubmit(apiData);

      setDocumentLoadingStates(prev => ({
        ...prev,
        [documentLabel]: false,
      }));
    } catch (error) {
      console.log('Error uploading document:', error);
      setDocumentLoadingStates(prev => ({
        ...prev,
        [documentLabel]: false,
      }));
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

  const openDocument = url => {
    Linking.openURL(url).catch(err => {
      Alert.alert('Error', 'Unable to open document');
      console.error('Error opening URL:', err);
    });
  };

  const isImageFile = url => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const renderDocumentPreview = documentName => {
    const documents = groupedDocuments[documentName] || [];

    if (documents.length === 0) {
      return null;
    }

    return (
      <View>
        <Text style={[styles.txtCardHeading, {fontSize: 14}]}>
          Uploaded {documentName}s ({documents.length})
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.previewScrollView}>
          {documents.map((doc, index) => (
            <TouchableOpacity
              key={doc.id}
              style={{
                height: 60,
                width: 60,
                borderRadius: 10,
                marginTop: 10,
                backgroundColor: '#EFF6FF',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => openDocument(doc.documentUrl)}>
              {doc.documentUrl && (
                <Image
                  source={Images.documents}
                  style={{
                    height: 36,
                    width: 36,
                    borderRadius: 10,
                    tintColor: COLORS.APP_PRIMARY_MAIN,
                  }}
                  resizeMode="cover"
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  console.log('Uploaded Documents:', selectedDocumentType);
  return (
    <GestureHandlerRootView style={styles.container}>
      <View
        style={{
          flex: 7,
          paddingHorizontal: 16,
        }}>
        <ScrollView>
          <View>
            <Text style={styles.txtHeading}>Additional Documents</Text>
            <Text style={styles.txtDescription}>
              Please upload the required documents to complete your application.
            </Text>
          </View>

          {additionalDocuments?.map((ele, index) => {
            const uploaded = uploadedDocuments[ele.label];
            const hasExistingDocuments =
              groupedDocuments[ele.label]?.length > 0;
            const isThisDocumentLoading = documentLoadingStates[ele.label];
            return (
              <View key={index} style={styles.card}>
                {!hasExistingDocuments && (
                  <Text style={styles.txtCardHeading}>{ele.label}</Text>
                )}

                {hasExistingDocuments ? (
                  renderDocumentPreview(ele.label)
                ) : (
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
                      onPress={() => handleDocumentUpload(ele.label)}
                      isLoading={isThisDocumentLoading}
                      btnTextStyle={{fontSize: 14}}
                    />
                  </View>
                )}
              </View>
            );
          })}
          <View style={styles.requirementDocument}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginBottom: 5,
              }}>
              <FontAwesome5
                name="info-circle"
                color={COLORS.APP_BLUE}
                size={16}
              />
              <Text style={styles.txtPhotoRequirements}>Upload Tips</Text>
            </View>
            {[
              'Ensure documents are clear and readable',
              'All text should be visible and not cut off',
              'File size should not exceed 10MB per document',
            ].map((ele, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    marginTop: 5,
                  }}>
                  <AntDesign
                    name="check"
                    color={COLORS.APP_BLUE}
                    size={16}
                  />
                  <Text style={styles.txtRequirementDesc}>{ele}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
      <View style={{flex: 1, paddingHorizontal: 16, justifyContent: 'center'}}>
        <Button
          title="Confirm"
          onPress={onPressConfirmBtn}
          // disabled={additionalDocuments?.some(
          //   doc => !groupedDocuments[doc.label]?.length,
          // )}
        />
      </View>

      <CommonBottomSheet
        bottomSheetRef={bottomSheetRef}
        handleSheetChanges={handleSheetChanges}
        onPressPDF={pickDocument}
        onPressImage={pickImage}
        heading={'Upload Document'}
        descriptions={'Choose document'}
      />
    </GestureHandlerRootView>
    // <GestureHandlerRootView style={styles.gestureContainer}>
    //   <View style={{paddingHorizontal: 16}}>
    //     <Typography
    //       title={'Additional Documents'}
    //       align="center"
    //       font={FONTS.INTER_MEDIUM}
    //       mt={5}
    //     />
    //     <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}>
    //       <View style={{marginTop: 20}}>
    //         {additionalDocuments?.map((ele, index) => {
    // const uploaded = uploadedDocuments[ele.label];
    // const hasExistingDocuments =
    //   groupedDocuments[ele.label]?.length > 0;
    // const isThisDocumentLoading = documentLoadingStates[ele.label];

    //           return (
    //             <View key={index} style={styles.documentContainer}>
    //               <View style={styles.documentSection}>
    //                 <View
    //                   style={{
    //                     flexDirection: 'row',
    //                     alignItems: 'center',
    //                     gap: 10,
    //                   }}>
    //                   <Icon
    //                     icon="MaterialIcons"
    //                     name="attach-file"
    //                     size={20}
    //                     color={COLORS.APP_PRIMARY_MAIN}
    //                   />
    //                   <Text style={styles.txtDocumentText}>{ele.label}</Text>
    //                 </View>
    //                 <View
    //                   style={{
    //                     flexDirection: 'row',
    //                     alignItems: 'center',
    //                     gap: 10,
    //                   }}>
    //                   {isThisDocumentLoading ? (
    //                     <ActivityIndicator
    //                       size={16}
    //                       color={COLORS.APP_PRIMARY_MAIN}
    //                     />
    //                   ) : (
    //                     <>
    //                       {hasExistingDocuments && (
    //                         <MaterialIcons
    //                           name="check-circle"
    //                           size={20}
    //                           color={COLORS.APP_SUCCESS}
    //                         />
    //                       )}
    //                     </>
    //                   )}
    //                   {!hasExistingDocuments && !isThisDocumentLoading && (
    //                     <TouchableOpacity
    //                       onPress={() => handleDocumentUpload(ele.label)}>
    //                       <AntDesign
    //                         name="upload"
    //                         size={20}
    //                         color={COLORS.APP_PRIMARY_MAIN}
    //                       />
    //                     </TouchableOpacity>
    //                   )}
    //                 </View>
    //               </View>

    //               {/* Show preview for existing documents */}
    //               {renderDocumentPreview(ele.label)}
    //             </View>
    //           );
    //         })}
    //       </View>
    //       <View style={{marginVertical: 20,marginBottom:80}}>
    // <Button
    //   title="Confirm"
    //   onPress={onPressConfirmBtn}
    //   disabled={additionalDocuments?.some(
    //     doc => !groupedDocuments[doc.label]?.length,
    //   )}
    // />
    //       </View>
    //     </ScrollView>
    //   </View>

    //   <>
    //   <CommonBottomSheet
    //     bottomSheetRef={bottomSheetRef}
    //     handleSheetChanges={handleSheetChanges}
    //     onPressPDF={pickDocument}
    //     onPressImage={pickImage}
    //     heading={'Upload Document'}
    //     descriptions={'Choose document'}
    //   />
    // </>
    // </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  txtHeading: {
    fontSize: 20,
    fontFamily: FONTS.INTER_SEMIBOLD,
    color: COLORS.APP_COMMON_BLACK,
  },
  txtDescription: {
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    marginTop: 5,
    color: '#4B5563',
  },
  card: {
    backgroundColor: COLORS.APP_WHITE,
    padding: 16,
    elevation: 2,
    marginHorizontal: 5,
    borderRadius: 10,
    marginBlock: 16,
  },
  txtCardHeading: {
    fontSize: 16,
    fontFamily: FONTS.INTER_SEMIBOLD,
    color: COLORS.APP_BLACK,
  },
  uploadCard: {
    borderWidth: 2,
    borderColor: COLORS.APP_BORDER,
    borderStyle: 'dotted',
    borderRadius: 20,
    height: 180,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  txtSubLabel: {
    fontSize: 12,
    fontFamily: FONTS.INTER_REGULAR,
    color: '#9CA3AF',
    marginTop: 5,
  },

  txtLabel: {
    fontSize: 12,
    fontFamily: FONTS.INTER_REGULAR,
    color: '#4B5563',
    marginTop: 5,
    textAlign:"center"
  },

  requirementDocument: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 16,
  },
  txtRequirementDesc: {
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 12,
    color: COLORS.APP_BLUE,
  },
  txtPhotoRequirements: {
    fontFamily: FONTS.INTER_SEMIBOLD,
    fontSize: 14,
    color: COLORS.APP_BLUE,
  },
});

export default AdditionalDocuments;
