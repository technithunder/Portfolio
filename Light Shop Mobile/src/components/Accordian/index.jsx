import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Icon from '../VectorIcon'

const Accordian = ({title}) => {
  return (
    <View>
      <Text style={styles.txt}>{title}</Text>
      <Icon icon='MaterialIcons' name='keyboard-arrow-down' size={18}/>
    </View>
  )
}

const styles = StyleSheet.create({

})

export default Accordian;