import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DocumentScanner from 'react-native-document-scanner-plugin';
import LinearGradient from 'react-native-linear-gradient';
//import images
import SCANNER_IMAGE from '../../../../assets/images/scan.png';
//relative path imports
import {FONTS} from '../../../config/font';
import {COLORS} from '../../../config/colors';
import StyledButton from '../../../components/StyledButton';
import {convertToBase64, IS_ANDROID} from '../../../utils/helper';
import FastImage from 'react-native-fast-image';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {moderateScale} from 'react-native-size-matters';
import {HEIGHT} from '../../../theme/commSty';
import CommonButton from '../../../components/CommonButton';
import {Images} from '../../../config';

const {width} = Dimensions.get('window');

const Passport = ({
  onSubmit,
  stepInfo,
  isLoading,
  setActiveStep,
  submitLoading,
  countryName,
  onBack,
}) => {
  const [passportFront, setPassportFront] = useState(stepInfo?.front || null);
  const [passportBack, setPassportBack] = useState(stepInfo?.back || null);
  const [currentSide, setCurrentSide] = useState('front');
  const [frontImageLoading, setFrontImageLoading] = useState(true);
  const [backImageLoading, setBackImageLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  console.log('Passport Front:', passportFront);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const scanDocument = async side => {
    try {
      setCurrentSide(side);
      const {scannedImages} = await DocumentScanner.scanDocument({
        maxNumDocuments: 1,
      });

      if (scannedImages.length > 0) {
        if (side === 'front') {
          setPassportFront(scannedImages[0]);
        } else {
          setPassportBack(scannedImages[0]);
        }
      }
    } catch (error) {
      console.error('Scanning error:', error);
    }
  };

  const uploadDocument = async () => {
    if (passportFront && passportBack) {
      if (
        stepInfo?.front === passportFront &&
        stepInfo?.back === passportBack
      ) {
        console.log('welcome');
        setActiveStep(2);
      } else {
        console.log('Uploading documents...');
        try {
          let finalFrontImage = passportFront;
          let finalBackImage = passportBack;

          if (!passportFront.startsWith('data:')) {
            finalFrontImage = await convertToBase64(passportFront);
          }

          if (!passportBack.startsWith('data:')) {
            finalBackImage = await convertToBase64(passportBack);
          }

          const passportData = {
            passportFront: finalFrontImage,
            passportBack: finalBackImage,
          };

          onSubmit(passportData);
        } catch (error) {
          console.error('Error converting images:', error);
        }
      }
    }
  };

  const renderImage = (imageSrc, side, loadingState, setLoadingState) => {
    const isScanned = imageSrc !== null;
    const isFront = side === 'front';

    return (
      <View style={styles.card}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.txtPassportLabel}>
            {isFront ? 'Front of Passport' : 'Back of Passport'}
          </Text>
          <View style={styles.requiredChip}>
            <Text style={styles.txtRequired}>Required</Text>
          </View>
        </View>

        {loadingState && !submitLoading && isScanned && (
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              width={'100%'}
              height={100}
              borderRadius={10}
              alignSelf="center"
              position="absolute"
              zIndex={-99}
            />
          </SkeletonPlaceholder>
        )}

        {isScanned ? (
          <View style={{height: 200, marginTop: 10, borderRadius: 10}}>
            <FastImage
              source={{uri: imageSrc, cache: FastImage.priority.high}}
              style={{height: 200, marginTop: 10, borderRadius: 10}}
              fallback={IS_ANDROID}
              onLoad={() => setLoadingState(false)}
              onLoadStart={() => setLoadingState(true)}
            />
          </View>
        ) : (
          <View style={styles.passportView}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#324D75',
                borderStyle: 'dashed',
                borderRadius: 10,
                height: 70,
                width: 70,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={Images.new_passport_icon}
                style={{
                  height: 45,
                  width: 45,
                  tintColor: COLORS.APP_PRIMARY_MAIN,
                }}
              />
            </View>
            <Text style={styles.txtPassportDesc}>{`Position the ${
              isFront ? 'front' : 'back'
            } page of your
passport within the frame`}</Text>
          </View>
        )}

        <CommonButton
          leftIcon={Images.camera_icon}
          btnText={`Scan ${isFront ? 'Front' : 'Back'} of Passport`}
          style={{marginTop: 30}}
          onPress={() => scanDocument(side)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 7,
          paddingHorizontal: 16,
        }}>
        <ScrollView>
          <Text style={styles.txtHeading}>Scan your passport</Text>

          <View>
            {renderImage(
              passportFront,
              'front',
              frontImageLoading,
              setFrontImageLoading,
            )}
            {renderImage(
              passportBack,
              'back',
              backImageLoading,
              setBackImageLoading,
            )}
          </View>

          <View style={{marginBlock: 20}}>
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
              <Text style={styles.txtPhotoRequirements}>Guidelines</Text>
            </View>
            {[
              'Ensure all text is clearly visible',
              'Place passport on a flat, well-lit surface',
              'Avoid glare and shadows',
              'Make sure the entire passport is within the frame',
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
                    color={COLORS.APP_PRIMARY_MAIN}
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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={[
              styles.buttonContainer,
              {backgroundColor: COLORS.APP_GRAY_LIGHT},
            ]}
            onPress={onBack}>
            <Text style={[styles.txtButton, {color: COLORS.APP_BLACK}]}>
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonContainer,
              {backgroundColor: COLORS.APP_PRIMARY},
            ]}
            onPress={uploadDocument}>
            <Text style={[styles.txtButton, {color: COLORS.APP_WHITE}]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.APP_WHITE,
    padding: 16,
    elevation: 2,
    marginHorizontal: 5,
    borderRadius: 10,
    marginTop: 16,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  txtButton: {
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
  },
  txtHeading: {
    fontSize: 20,
    fontFamily: FONTS.INTER_SEMIBOLD,
    color: COLORS.APP_COMMON_BLACK,
  },
  txtPhotoRequirements: {
    fontFamily: FONTS.INTER_SEMIBOLD,
    fontSize: 14,
    color: COLORS.APP_BLACK,
  },
  txtRequirementDesc: {
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 12,
    color: '#4B5563',
  },
  txtPassportLabel: {
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_BLACK,
  },
  requiredChip: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtRequired: {
    fontSize: 12,
    color: '#324D75',
    fontFamily: FONTS.INTER_MEDIUM,
  },
  passportView: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: COLORS.APP_BORDER,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtPassportDesc: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.APP_COMMON_GRAY,
    fontFamily: FONTS.INTER_MEDIUM,
  },
});

export default Passport;
