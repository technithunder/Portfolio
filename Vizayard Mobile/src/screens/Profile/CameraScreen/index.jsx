import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../config/colors';
import { useRoute } from '@react-navigation/native';

const CameraScreen = ({ navigation,  }) => {
  const route = useRoute()
  const { onPhotoTaken } = route.params;
  const cameraRef = useRef(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [flash, setFlash] = useState('off');
  const [photoTaken, setPhotoTaken] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState('not-determined');
  
  const devices = useCameraDevices();
  const device = isFrontCamera ? devices.front : devices.back;
  
  useEffect(() => {
  }, []);

  const checkPermissions = async () => {
    try {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      console.log('Camera Permission Status:', cameraPermission);
      setCameraPermissionStatus(cameraPermission);

      if (cameraPermission !== 'authorized') {
        const newCameraPermission = await Camera.requestCameraPermission();
        setCameraPermissionStatus(newCameraPermission);

        if (newCameraPermission !== 'authorized') {
          Alert.alert(
            'Camera Permission Needed',
            'This app requires access to your camera. Please enable camera permissions from settings.',
            [
              {
                text: 'Cancel',
                onPress: () => navigation.goBack(),
                style: 'cancel',
              },
              {
                text: 'Open Settings',
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:');
                  } else {
                    Linking.openSettings();
                  }
                },
              },
            ],
            { cancelable: false }
          );
        }
      }
    } catch (error) {
      console.error('Error checking camera permissions:', error);
      Alert.alert('Error', 'Failed to check camera permissions');
      navigation.goBack();
    }
  };
  
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto({
          flash: flash,
          quality: 90,
        });
        
        const fileUri = `file://${photo.path}`;
        setPhotoTaken(fileUri);
        setIsPreview(true);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    } else {
      console.warn('Camera reference is not available');
    }
  };
  
  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };
  
  const toggleFlash = () => {
    setFlash(flash === 'off' ? 'on' : 'off');
  };
  
  const confirmPhoto = async () => {
    if (photoTaken && onPhotoTaken) {
      onPhotoTaken(photoTaken);
      navigation.goBack();
    }
  };
  
  const retakePhoto = () => {
    setPhotoTaken(null);
    setIsPreview(false);
  };
  
  if (cameraPermissionStatus !== 'authorized') {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.text}>Camera permission not granted</Text>
        <TouchableOpacity 
          style={styles.buttonConfirm} 
          onPress={checkPermissions}
        >
          <Text style={styles.buttonText}>Request Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (!device) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.text}>Loading camera...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.APP_BLACK} />
      
      {isPreview ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoTaken }} style={styles.previewImage} />
          
          <View style={styles.previewButtons}>
            <TouchableOpacity style={styles.buttonRetake} onPress={retakePhoto}>
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.buttonConfirm} onPress={confirmPhoto}>
              <Text style={styles.buttonText}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            device={device}
            isActive={true}
            photo={true}
            enableZoomGesture
          />
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={28} color={COLORS.APP_WHITE} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={toggleFlash}>
              <Ionicons 
                name={flash === 'off' ? 'flash-off' : 'flash'} 
                size={28} 
                color={COLORS.APP_WHITE} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.flipButton} onPress={toggleCamera}>
              <MaterialIcons name="flip-camera-android" size={30} color={COLORS.APP_WHITE} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_BLACK,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.APP_BLACK,
    padding: 20,
  },
  camera: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.APP_WHITE,
  },
  flipButton: {
    position: 'absolute',
    right: 30,
  },
  text: {
    color: COLORS.APP_WHITE,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: COLORS.APP_BLACK,
  },
  previewImage: {
    flex: 1,
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonRetake: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  buttonConfirm: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: COLORS.APP_PRIMARY,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: COLORS.APP_WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CameraScreen;