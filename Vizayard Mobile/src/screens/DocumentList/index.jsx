import React, {useContext, useState} from 'react';
// import {useRoute} from '@react-navigation/native';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';
import {Container, Icon, Typography} from '../../components';
import {COLORS} from '../../config/colors';
import {AuthContext} from '../../context/AuthContext';
import {convertToBase64} from '../../utils/helper';
import {updateUser} from '../../api';
import LoadingModal from '../../components/LoadingModal';
import {addUserToken} from '../../redux/MainSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import BottomDrawer from '../../components/BottomDrawer';
import {launchImageLibrary} from 'react-native-image-picker';
import Entypo from 'react-native-vector-icons/Entypo';
import { FONTS } from '../../config/font';

const DocumentList = () => {
  const {user, login} = useContext(AuthContext);
  const dispatch = useDispatch();
  console.log(user);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [bottomDrawerVisible, setBottomDrawerVisible] = useState(false);

  const openItrGallery = async () => {
    setBottomDrawerVisible(false);
    setIsLoadingModal(true);

    try {
      const result = await new Promise(resolve => {
        launchImageLibrary({mediaType: 'photo', includeBase64: true}, resolve);
      });

      if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        let imageBase64 = selectedImage.base64;

        if (!imageBase64) {
          imageBase64 = await convertToBase64(selectedImage.uri);
        } else {
          imageBase64 = `data:${selectedImage.type};base64,${imageBase64}`;
        }

        const obj = {
          incomeTaxReturn: imageBase64,
        };

        const res = await updateUser(user?.id, obj, user?.token);

        if (res?.data?.status) {
          const updatedUserData = {
            ...user,
            incomeTaxReturn: res?.data?.data?.incomeTaxReturn,
          };

          login(updatedUserData);
          await AsyncStorage.setItem(
            'userSession',
            JSON.stringify(updatedUserData),
          );
          if (updatedUserData.token) {
            dispatch(addUserToken(updatedUserData.token));
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'Failed to upload ITR Certificate',
          });
        }
      }
    } catch (error) {
      console.error('Error uploading ITR Certificate:', error);
    } finally {
      setIsLoadingModal(false);
    }
  };

  const uploadDocument = async side => {
    try {
      setIsLoadingModal(true);
      const {scannedImages} = await DocumentScanner.scanDocument({
        maxNumDocuments: 1,
      });

      if (scannedImages.length > 0) {
        if (side === 'front') {
          let finalFrontImage = scannedImages[0];
          if (!finalFrontImage.startsWith('data:')) {
            finalFrontImage = await convertToBase64(finalFrontImage);
          }
          let obj = {
            passportFront: finalFrontImage,
          };
          try {
            const res = await updateUser(user?.id, obj, user?.token);
            console.log('Response for passport front:', res);
            if (res?.data?.status) {
              console.log(
                'Passport front uploaded successfully',
                res?.data?.data,
              );
              const updatedUserData = {
                ...user,
                passportFront: res?.data?.data?.passportFront,
              };

              login(updatedUserData);
              await AsyncStorage.setItem(
                'userSession',
                JSON.stringify(updatedUserData),
              );
              if (updatedUserData.token) {
                dispatch(addUserToken(updatedUserData.token));
              }
              setIsLoadingModal(false);
            } else {
              setIsLoadingModal(false);
            }
          } catch (error) {
            setIsLoadingModal(false);
            console.error('Error uploading passport front:', error);
          }
        } else if (side === 'back') {
          let finalBackImage = scannedImages[0];
          if (!finalBackImage.startsWith('data:')) {
            finalBackImage = await convertToBase64(finalBackImage);
          }
          let obj = {
            passportBack: finalBackImage,
          };
          try {
            const res = await updateUser(user?.id, obj, user?.token);
            console.log('Response for passport back:', res);
            if (res?.data?.status) {
              const updatedUserData = {
                ...user,
                passportBack: res?.data?.data?.passportBack,
              };

              login(updatedUserData);
              await AsyncStorage.setItem(
                'userSession',
                JSON.stringify(updatedUserData),
              );
              if (updatedUserData.token) {
                dispatch(addUserToken(updatedUserData.token));
              }
              setIsLoadingModal(false);
            } else {
              setIsLoadingModal(false);
            }
          } catch (error) {
            setIsLoadingModal(false);
            console.error('Error uploading passport back:', error);
          }
        }
      } else {
        setIsLoadingModal(false);
      }
    } catch (error) {
      setIsLoadingModal(false);
      console.error('Scanning error:', error);
    }
  };

  return (
    <Container
      style={{flex: 1, backgroundColor: COLORS.APP_WHITE}}
      title={'Document'}
      showBack>
      {user?.incomeTaxReturn && (
        <View>
          <View style={styles.divider} />
          <View style={styles.listItem}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 14}}>
              <Image
                source={{uri: user?.incomeTaxReturn}}
                style={{height: 70, width: 70, borderRadius: 10}}
              />
              <Typography title={'Income Tax Return'} size={16} />
            </View>
            <Icon
              icon="MaterialIcons"
              name="edit"
              size={20}
              onPress={() => setBottomDrawerVisible(true)}
            />
          </View>
        </View>
      )}
      {user?.passportFront && (
        <View>
          <View style={styles.divider} />
          <View style={styles.listItem}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 14}}>
              <Image
                source={{uri: user?.passportFront}}
                style={{height: 70, width: 70, borderRadius: 10}}
              />
              <Typography title={'Passport Front'} size={16} />
            </View>
            <Icon
              icon="MaterialIcons"
              name="edit"
              size={20}
              onPress={() => uploadDocument('front')}
            />
          </View>
        </View>
      )}
      {user?.passportBack && (
        <View>
          <View style={styles.divider} />
          <View style={styles.listItem}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 14}}>
              <Image
                source={{uri: user?.passportBack}}
                style={{height: 70, width: 70, borderRadius: 10}}
              />
              <Typography title={'Passport Back'} size={16} />
            </View>
            <Icon
              icon="MaterialIcons"
              name="edit"
              size={20}
              onPress={() => uploadDocument('back')}
            />
          </View>
        </View>
      )}
      <BottomDrawer
        visible={bottomDrawerVisible}
        onClose={() => setBottomDrawerVisible(false)}
        height={180}>
        <View style={styles.drawerContainer}>
          <Text style={styles.drawerTitle}>Update Income Tax Return</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={openItrGallery}>
              <Entypo
                name="camera"
                icon="Entypo"
                size={24}
                color={COLORS.APP_GRAY}
              />
              <Text style={styles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomDrawer>
      <LoadingModal isVisible={isLoadingModal} step={1} />
    </Container>
  );
};

export default DocumentList;

const styles = StyleSheet.create({
  listItem: {
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    backgroundColor: '#E6E6E6',
    height: 1,
    marginTop: 10,
  },
  drawerContainer: {
    padding: 20,
    width: '100%',
    // backgroundColor:"red",
    // alignItems:'flex-start'
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.APP_BLACK,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  option: {
    alignItems: 'center',
    padding: 10,
  },
  optionIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  optionText: {
    marginTop: 10,
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 14,
    color: COLORS.APP_BLACK,
  },
});
