import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {WebView} from 'react-native-webview';
import {Icon} from '../../components';

const {width, height} = Dimensions.get('window');

const data = {
  videoUrl:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
};

const Help = ({navigation}) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const handleBackPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    } else {
      console.log('Back button pressed');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000"
        translucent={true}
      />

      <View style={styles.backButtonContainer}>
        <Icon
          icon="Ionicons"
          name="arrow-back"
          size={28}
          onPress={handleBackPress}
          color='white'
        />
      </View>

      <WebView
        source={{uri: data.videoUrl}}
        style={styles.webView}
        allowsFullscreenVideo={true}
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState={true}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
          setIsVideoLoading(false);
        }}
        onLoadStart={() => setIsVideoLoading(true)}
        onLoadEnd={() => setIsVideoLoading(false)}
        onHttpError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn('WebView HTTP error: ', nativeEvent);
        }}
        onRenderProcessGone={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn('WebView render process gone: ', nativeEvent);
        }}
        originWhitelist={['*']}
        allowsInlineMediaPlayback={true}
        allowsProtectedMedia={true}
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scalesPageToFit={Platform.OS === 'android'}
      />

      {/* Loading Overlay */}
      {isVideoLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <View style={styles.loadingSpinner}>
              <Text style={styles.loadingDot}>●</Text>
              <Text style={styles.loadingDot}>●</Text>
              <Text style={styles.loadingDot}>●</Text>
            </View>
            <Text style={styles.loadingText}>Loading Video...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 60,
    left: 20,
    zIndex: 100,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: -2,
  },
  webView: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingSpinner: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  loadingDot: {
    fontSize: 20,
    color: '#fff',
    marginHorizontal: 5,
    opacity: 0.6,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default Help;
