import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';

const ScheduleCall = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.txtConsultingCall}>Consulting Call</Text>
      <View style={styles.webViewContainer}>
        <WebView
          source={{uri: 'https://calendly.com/visauniversaltravelplanners/30min'}}
          style={styles.webView}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    </SafeAreaView>
  );
};

export default ScheduleCall;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
    paddingHorizontal: 16,
  },
  txtConsultingCall: {
    fontFamily: FONTS.INTER_BOLD,
    color: COLORS.APP_BLACK,
    fontSize: 22,
    marginTop: 20,
  },
  webViewContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    marginTop:20
  },
  webView: {
    flex: 1,
  },
});
