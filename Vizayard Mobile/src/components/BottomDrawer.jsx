import React, {useEffect, useRef} from 'react';
import {
  Modal,
  Animated,
  TouchableOpacity,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';
import {COLORS} from '../config/colors';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const BottomDrawer = ({
  visible,
  onClose,
  children,
  height = 150,
  duration = 300,
  isCountry = false,
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current; 

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: duration,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height, 
        duration: duration,
        useNativeDriver: true,
      }).start(() => {
        onClose();
      });
    }
  }, [visible, height, duration]);

  return (
    <Modal transparent={true} visible={visible} animationType="none">
      {isCountry ? (
        <View style={styles.overlay}>
          <KeyboardAwareScrollView
            style={{backgroundColor: COLORS.APP_WHITE, flex: 1}}>
            {children}
          </KeyboardAwareScrollView>
        </View>
      ) : (
        <TouchableOpacity style={styles.overlay} onPress={onClose}>
          <Animated.View
            style={[
              styles.drawer,
              {
                minHeight: height,
                transform: [{translateY: slideAnim}],
              },
            ]}>
            {children}
          </Animated.View>
        </TouchableOpacity>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
  content: {
    padding: 0,
    margin: 0,
  },
});

export default BottomDrawer;
