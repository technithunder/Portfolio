import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../config/colors';
import Photos from './Photo';
import Passport from './Passport';
import Details from './Details';
import {AuthContext} from '../../context/AuthContext';
import {createChildUser, getSingleChildUser} from '../../api';
import {useRoute} from '@react-navigation/native';
import LoadingModal from '../../components/LoadingModal';
import {formatDate} from '../../utils/helper';
import Indicator from './components/Indicator';
import {moderateScale} from 'react-native-size-matters';
import {Container} from '../../components';
import {replace} from '../../utils';
import {useSelector} from 'react-redux';
import {getCountryDetail} from '../../redux';
import dayjs from 'dayjs';
import moment from 'moment';
import Documents from '../Document';
import AdditionalDocuments from './Documents';
import {add} from 'lodash';
import {FONTS} from '../../config/font';

const {width} = Dimensions.get('window');

const stepData = [
  {
    label: 'Photo',
    icon: color => <Feather name="camera" size={16} color={color} />,
  },
  {
    label: 'Passport',
    icon: color => <AntDesign name="scan1" size={16} color={color} />,
  },
  {
    label: 'Details',
    icon: color => <Feather name="folder-plus" size={16} color={color} />,
  },
  {
    label: 'Documents',
    icon: color => <Ionicons name="document" size={16} color={color} />,
  },
];

const VisaProcess = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const countryDetails = useSelector(getCountryDetail);
  const route = useRoute();
  const {
    visaId,
    childUserId,
    isEdit,
    countryName,
    visaGaurrentedOn,
    isPersonas,
    additionalDocuments,
  } = route?.params || {};
  const [stepInfo, setStepInfo] = useState({
    photo: '',
    passport: '',
    details: null,
    checkout: null,
    additionalDocuments: [],
  });
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    passportNumber: '',
    passportFrom: '',
    passportIssuedOn: '',
    passportValidTill: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: 'male',
    email: '',
    phoneNumber: '',
  });
  const [passportIssuedOn, setPassportIssuedOn] = useState(null);
  const [passportValidTill, setPassportValidTill] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log('additionalDocuments', countryDetails);

  useEffect(() => {
    const backAction = () => {
      if (loading) return true;
      handleBackPress();
      return true; // prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [loading, activeStep]);

  useEffect(() => {
    if (childUserId) {
      getChildDetails(childUserId);
    }
  }, [childUserId]);

  const getChildDetails = async id => {
    setLoading(true);
    try {
      const response = await getSingleChildUser(id);
      if (response?.data?.status) {
        const data = response?.data?.data;
        console.log('==>130', data);
        const childDetails =
          data?.childUser?.details || data?.childUser?.extractedVisaDetails;
        const object = {
          firstName: childDetails?.firstName || childDetails?.FIRST_NAME || '',
          lastName: childDetails?.lastName || childDetails?.LAST_NAME || '',
          passportNumber:
            childDetails?.passportNumber || childDetails?.DOCUMENT_NUMBER || '',
          passportFrom: childDetails?.passportFrom || childDetails?.FROM || '',
          passportIssuedOn:
            childDetails?.passportIssuedOn || childDetails?.DATE_OF_ISSUE || '',
          passportValidTill:
            childDetails?.passportValidUntil ||
            childDetails?.EXPIRATION_DATE ||
            '',
          dateOfBirth: childDetails?.dob || childDetails?.DATE_OF_BIRTH,
          placeOfBirth:
            childDetails?.placeOfBirth || childDetails?.PLACE_OF_BIRTH || '',
          gender: childDetails?.gender || childDetails?.GENDER || '',
          phoneNumber: childDetails?.phoneNumber || '',
          email: childDetails?.email || '',
        };
        setCurrentId(data?.childUser?.id);
        setStepInfo({
          ...stepInfo,
          photo: data?.childUser?.photo,
          passport: data?.childUser?.passport,
          details: object,
          additionalDocuments: data?.childUser?.documents,
        });
        setPersonalInfo(prev => ({
          ...object,
          ...prev,
        }));
        setPassportIssuedOn(
          childDetails?.passportIssuedOn
            ? formatDate(childDetails?.passportIssuedOn)
            : '',
        );
        setPassportValidTill(
          childDetails?.passportValidUntil
            ? formatDate(childDetails?.passportValidUntil)
            : '',
        );
        setDateOfBirth(childDetails?.dob ? formatDate(childDetails?.dob) : '');
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async data => {
    setSubmitLoading(true);

    let visaData = {
      parentUserId: user?.id,
      visaId: visaId,
    };
    if (childUserId && !isEdit) {
      visaData.childUserId = childUserId;
    }

    if (activeStep === 0) {
      setIsLoadingModal(true);
      visaData.step = 1;
      visaData.photo = data;
      if (isEdit) {
        visaData.id = currentId;
      } else {
        visaData.isNew = true;
      }
    }

    if (activeStep === 1) {
      setIsLoadingModal(true);
      visaData.step = 2;
      visaData.passportFront = data?.passportFront;
      visaData.passportBack = data?.passportBack;
      visaData.id = currentId;
    }

    if (activeStep === 2) {
      setIsLoading(true);
      visaData.step = 3;
      visaData.id = currentId;
      visaData.firstName = data?.firstName;
      visaData.lastName = data?.lastName;
      visaData.dob = data?.dateOfBirth;
      visaData.gender = data?.gender;
      visaData.placeOfBirth = data?.placeOfBirth;
      visaData.passportNumber = data?.passportNumber;
      visaData.passportFrom = data?.passportFrom;
      visaData.passportIssuedOn = data?.passportIssuedOn;
      visaData.passportValidUntil = data?.passportValidTill;
      visaData.phoneNumber = data?.phoneNumber;
      visaData.email = data?.email;
    }

    if (activeStep === 3) {
      console.log('welcome');
      setIsLoadingModal(true);
      visaData.step = 4;
      visaData.id = currentId;
      visaData.documentName = data?.documentName;
      visaData.document = data?.document;
    }

    try {
      const response = await createChildUser(visaData);
      console.log('Response:', response?.data?.data);
      if (response?.data?.status) {
        if (response?.data?.data?.id) {
          setCurrentId(response?.data?.data?.id);
        }
        if (activeStep === 0 && response?.data?.data?.photo) {
          setActiveStep(prev => prev + 1);
          setIsLoadingModal(false);
          setStepInfo({
            ...stepInfo,
            photo: response?.data?.data?.photo,
          });
        } else if (activeStep === 1 && response?.data?.data?.passport) {
          const extractedDetails = response?.data?.data?.extractedVisaDetails;
          const object = {
            firstName: extractedDetails?.FIRST_NAME || '',
            lastName: extractedDetails?.LAST_NAME || '',
            passportNumber: extractedDetails?.DOCUMENT_NUMBER || '',
            passportFrom: extractedDetails?.FROM || '',
            passportIssuedOn: extractedDetails?.DATE_OF_ISSUE,
            passportValidTill: extractedDetails?.EXPIRATION_DATE,
            dateOfBirth: extractedDetails?.DATE_OF_BIRTH,
            placeOfBirth: extractedDetails?.PLACE_OF_BIRTH || '',
            gender: extractedDetails?.GENDER || '',
          };
          setStepInfo({
            details: object,
            photo: response?.data?.data?.photo,
            passport: response?.data?.data?.passport,
          });
          setPersonalInfo(prev => ({
            ...prev,
            firstName:
              response?.data?.data?.extractedVisaDetails.FIRST_NAME || '',
            lastName:
              response?.data?.data?.extractedVisaDetails.LAST_NAME || '',
            passportNumber:
              response?.data?.data?.extractedVisaDetails.DOCUMENT_NUMBER || '',
            passportFrom: response?.data?.data?.extractedVisaDetails.FROM || '',
            passportIssuedOn: response?.data?.data?.extractedVisaDetails
              .DATE_OF_ISSUE
              ? formatDate(
                  response?.data?.data?.extractedVisaDetails.DATE_OF_ISSUE,
                )
              : '',
            passportValidTill: response?.data?.data?.extractedVisaDetails
              .EXPIRATION_DATE
              ? formatDate(
                  response?.data?.data?.extractedVisaDetails.EXPIRATION_DATE,
                )
              : '',
            dateOfBirth: response?.data?.data?.extractedVisaDetails
              .DATE_OF_BIRTH
              ? formatDate(
                  response?.data?.data?.extractedVisaDetails.DATE_OF_BIRTH,
                )
              : '',
            placeOfBirth:
              response?.data?.data?.extractedVisaDetails.PLACE_OF_BIRTH || '',
            gender: response?.data?.data?.extractedVisaDetails.GENDER
              ? response?.data?.data?.extractedVisaDetails.GENDER
              : 'male',
          }));
          setPassportIssuedOn(
            response?.data?.data?.extractedVisaDetails?.DATE_OF_ISSUE
              ? formatDate(
                  response?.data?.data?.extractedVisaDetails?.DATE_OF_ISSUE,
                )
              : '',
          );
          setPassportValidTill(
            response?.data?.data?.extractedVisaDetails?.EXPIRATION_DATE
              ? formatDate(
                  response?.data?.data?.extractedVisaDetails?.EXPIRATION_DATE,
                )
              : '',
          );
          setDateOfBirth(
            response?.data?.data?.extractedVisaDetails?.DATE_OF_BIRTH
              ? formatDate(
                  response?.data?.data?.extractedVisaDetails?.DATE_OF_BIRTH,
                )
              : '',
          );
          setActiveStep(prev => prev + 1);
          setIsLoadingModal(false);
        } else if (activeStep === 2) {
          if (response?.data?.data?.details) {
            let obj = {
              firstName: response?.data?.data?.details?.firstName,
              lastName: response?.data?.data?.details?.lastName,
              passportNumber: response?.data?.data?.details?.passportNumber,
              passportFrom: response?.data?.data?.details?.passportFrom,
              passportIssuedOn: response?.data?.data?.details?.passportIssuedOn,
              passportValidTill:
                response?.data?.data?.details?.passportValidUntil,
              dateOfBirth: response?.data?.data?.details?.dob,
              placeOfBirth: response?.data?.data?.details?.placeOfBirth,
              gender: response?.data?.data?.details?.gender || 'male',
              phoneNumber: response?.data?.data?.details?.phoneNumber,
              email: response?.data?.data?.details?.email,
            };
            setStepInfo({
              ...stepInfo,
              details: obj,
            });
            // if (isPersonas) {
            //   replace('Personas');
            // } else {
            //   replace('TravelDetails', {visaId});
            // }
          }
          if (additionalDocuments?.length > 0) {
            setActiveStep(prev => prev + 1);
          } else {
            if (isPersonas) {
              replace('Personas');
            } else {
              replace('TravelDetails', {visaId, additionalDocuments});
            }
          }
          setIsLoading(false);
        } else if (activeStep === 3) {
          console.log('Additional Documents Response:', response?.data?.data);
          const documentsArray = response?.data?.data?.documents || [];
          setStepInfo({
            ...stepInfo,
            additionalDocuments: documentsArray,
          });

          setIsLoadingModal(false);
          // setActiveStep(0);
          // if (isEdit) {
          //   replace('VisaDetails', {visaId, isEdit: true});
          // } else {
          //   replace('VisaDetails', {visaId});
          // }
        }
      }
    } catch (e) {
      setSubmitLoading(false);
      setIsLoadingModal(false);
      setIsLoading(false);
    } finally {
      setSubmitLoading(false);
      setIsLoadingModal(false);
      setIsLoading(false);
    }
  };

  const isStepCompleted = index => {
    switch (index) {
      case 0:
        return !!stepInfo.photo;
      case 1:
        return !!stepInfo.passport;
      case 2:
        return stepInfo?.details
          ? Object.values(stepInfo?.details)?.some(
              value => value !== '' && value !== undefined,
            )
          : false;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleBackPress = () => {
    if (loading) return;

    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const onPressPhotoEditBtn = index => {
    if (index === 0) {
      setActiveStep(0);
    } else if (index === 1) {
      setActiveStep(1);
    } else if (index === 2) {
      setActiveStep(2);
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (loading) return true;
      if (activeStep > 0) {
        setActiveStep(prev => prev - 1);
        return true;
      } else {
        navigation.goBack();
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [activeStep, loading]);

  const handleStepPress = index => {
    if (loading) return;
    if (isStepCompleted(index)) {
      setActiveStep(index);
      setMaxStepReached(Math.max(maxStepReached, index));
    }
  };

  const getNextIncompleteStep = () => {
    for (let i = 0; i < stepData.length; i++) {
      if (!isStepCompleted(i)) {
        return i;
      }
    }
    return -1;
  };

  const onClickConfirmBtn = () => {
    if (isPersonas) {
      replace('Personas');
    } else {
      replace('TravelDetails', {visaId, additionalDocuments});
    }
  };

  const getHeaderName = () => {
    const headerMap = {
      0: countryDetails?.basicDetails?.countryName || '',
      1: 'Passport Scan',
      2: 'Visa Application',
      3: 'Additional Document',
    };
    return headerMap[activeStep] || '';
  };

  return (
    <Container
      contentContainerStyle={{flex: 1, backgroundColor: COLORS.APP_WHITE}}
      showHeader={false}>
      {activeStep !== 3 && (
        <LoadingModal isVisible={isLoadingModal} step={activeStep} />
      )}
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={20} color={COLORS.APP_GRAY} />
            </TouchableOpacity>
            <View>
              <Text style={styles.txtCountryName}>{getHeaderName()}</Text>
            </View>
            {activeStep === 3 ?<TouchableOpacity onPress={() => {
               replace('TravelDetails', {visaId, additionalDocuments});
            }}>
              <Text style={styles.txtSkip}>Skip</Text>
            </TouchableOpacity> : <TouchableOpacity onPress={() => navigation.navigate('Bottom')}>
            <Fontisto name="home" size={20} color={COLORS.APP_GRAY} />
          </TouchableOpacity>}
            {/* <View style={styles.chipView}>
            <Ionicons name="shield-checkmark" color="#fff" size={16} />
            <Text style={styles.txtDateDesc}>
              Visa on{' '}
              {`${moment
                .utc(countryDetails?.visaDetails?.visaGaurrentedOn)
                .format('ddd, DD MMM')} ${moment
                .utc(countryDetails?.visaDetails?.visaTime, 'HH:mm')
                .format('hh:mm A')}`}
            </Text>
          </View> */}
          
            {/* <TouchableOpacity onPress={() => navigation.navigate('Bottom')}>
            <Fontisto name="home" size={20} color={COLORS.APP_GRAY} />
          </TouchableOpacity> */}
          </View>
        </View>
        <View style={styles.stepContainer}>
          <Indicator currentPosition={activeStep} onPress={handleStepPress} />
        </View>
      </View>
      <View
        style={{
          flex: 3,
          backgroundColor: COLORS.APP_WHITE,
        }}>
        {activeStep === 0 && (
          <Photos
            isLoading={loading}
            setActiveStep={setActiveStep}
            stepInfo={stepInfo?.photo}
            onSubmit={onSubmit}
            submitLoading={submitLoading}
            countryName={countryDetails?.basicDetails?.countryName}
          />
        )}
        {activeStep === 1 && (
          <Passport
            isLoading={loading}
            setActiveStep={setActiveStep}
            stepInfo={stepInfo?.passport}
            onSubmit={onSubmit}
            submitLoading={submitLoading}
            countryName={countryName}
            onBack={() => setActiveStep(0)}
          />
        )}
        {activeStep === 2 && (
          <Details
            dateOfBirth={dateOfBirth}
            setDateOfBirth={setDateOfBirth}
            passportValidTill={passportValidTill}
            setPassportValidTill={setPassportValidTill}
            passportIssuedOn={passportIssuedOn}
            setPassportIssuedOn={setPassportIssuedOn}
            setPersonalInfo={setPersonalInfo}
            personalInfo={personalInfo}
            setActiveStep={setActiveStep}
            stepInfo={stepInfo}
            onSubmit={onSubmit}
            onPressPassportEditBtn={() => onPressPhotoEditBtn(1)}
            onPressPhotoEditBtn={() => onPressPhotoEditBtn(0)}
            onPressVisaValidityEditBtn={() => onPressPhotoEditBtn(0)}
            visaGaurrentedOn={countryDetails?.visaDetails?.visaGaurrentedOn}
            isLoading={isLoading}
            additionalDocuments={additionalDocuments}
          />
        )}
        {activeStep === 3 && (
          <AdditionalDocuments
            additionalDocuments={additionalDocuments}
            visaId={visaId}
            onSubmit={onSubmit}
            submitLoading={submitLoading}
            stepInfo={stepInfo?.additionalDocuments}
            onPressConfirmBtn={onClickConfirmBtn}
            isLoadingModal={isLoadingModal}
          />
        )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    paddingBottom: 20,
    paddingTop: Platform.OS === 'android' ? 10 : 10,
    paddingHorizontal: 20,
    borderBottomColor: COLORS.APP_BORDER,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width:"100%",
  },
  chipView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.APP_PRIMARY_MAIN,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  txtDateDesc: {
    color: '#fff',
    marginLeft: 5,
  },
  stepContainer: {
    marginTop: moderateScale(20),
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 40,
  },
  step: {
    alignItems: 'center',
    position: 'relative',
  },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    zIndex: 999,
    borderColor: COLORS.APP_PRIMARY_MAIN,
  },
  circleText: {
    color: COLORS.APP_BLACK,
    fontWeight: 'bold',
  },
  stepLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#333',
  },
  line: {
    position: 'absolute',
    top: 17,
    width: 130,
    height: 2,
    zIndex: 1,
    left: 30,
    backgroundColor: COLORS.APP_PRIMARY_MAIN,
  },
  successIcon: {
    height: 120,
    width: 120,
    marginBlock: 60,
  },
  txtCountryName: {
    fontSize: 18,
    fontFamily: FONTS.INTER_SEMIBOLD,
  },
  txtSkip:{
    color:COLORS.APP_PRIMARY_MAIN,
    textDecorationLine:"underline",
    fontFamily:FONTS.INTER_MEDIUM
 }
});

export default VisaProcess;