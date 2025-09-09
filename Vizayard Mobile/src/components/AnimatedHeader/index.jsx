import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FONTS} from '../../config/font';

const AnimatedHeader = ({title}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    height: 60,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.INTER_BOLD,
    color: '#1A1A1A',
  },
});

export default AnimatedHeader;
