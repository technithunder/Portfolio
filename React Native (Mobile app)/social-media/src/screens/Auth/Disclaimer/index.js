import { WebView } from 'react-native-webview';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import LinearGradient from "react-native-linear-gradient";
import { CheckBox } from '@ui-kitten/components';


const index = ({ navigation }) => {
  const [isAccept, setisAccept] = useState(false)

  const onNextPress = () => {
    navigation.navigate('SetProfile');
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'http://seemee.ca/home/eula' }}
      />
      <CheckBox
        style={{ margin: 10 }}
        checked={isAccept}
        onChange={nextChecked => setisAccept(nextChecked)}>
        Are you agree with our End-User License Agreement
        </CheckBox>
      <TouchableOpacity disabled={!isAccept} onPress={onNextPress}>
        <LinearGradient style={[styles.btn]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
          <Text style={styles.seemeeText}>Next</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = {
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    marginHorizontal: 10
  },
}

export default index;
