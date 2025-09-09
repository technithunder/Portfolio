import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {moderateScale} from 'react-native-size-matters';
import {COLORS} from '../../config/colors';
import {Images} from '../../config';
import {Typography} from '../../components';
import {FONTS} from '../../config/font';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CommonButton from '../../components/CommonButton';
import CommonBottomSheet from '../../components/BottomSheet';
import DocumentPicker from 'react-native-document-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {convertPdfToBase64, convertToBase64} from '../../utils/helper';

const PendingDocuments = ({pendingDocuments, onSubmit}) => {
  const bottomSheetRef = useRef(null);
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [documentLoadingStates, setDocumentLoadingStates] = useState({});

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

  return (
    <>
      <View>
      {pendingDocuments?.map((ele, index) => {
        const isThisDocumentLoading = documentLoadingStates[ele.label];
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
                <Text style={styles.txtSubLabel}>PDF, JPG, PNG up to 10MB</Text>
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
            </View>
          </View>
        );
      })}
      </View>

      <CommonBottomSheet
        bottomSheetRef={bottomSheetRef}
        handleSheetChanges={handleSheetChanges}
        onPressPDF={pickDocument}
        onPressImage={pickImage}
        heading={'Upload Document'}
        descriptions={'Choose document'}
      />
    </>
  );
};

export default PendingDocuments;

const styles = StyleSheet.create({
  card: {
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
