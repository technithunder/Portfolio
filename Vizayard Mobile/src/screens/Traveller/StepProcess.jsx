import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { COLORS } from '../../config/colors'
import { FONTS } from '../../config/font'

const StepProcess = ({ step }) => {
  // calculate percentage based on step
  const progress = step === 1 ? '33%' : step === 2 ? '67%' : '100%'

  return (
    <View style={{ marginHorizontal: 16 }}>
      <Text style={styles.txtStep}>Step {step} of 3</Text>

      {/* Outer progress bar */}
      <View style={styles.progressbar}>
        {/* Inner filled progress */}
        <View style={[styles.progressFill, { width: progress }]} />
      </View>
    </View>
  )
}

export default StepProcess

const styles = StyleSheet.create({
  txtStep: {
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.LABEL_COLOR,
    fontSize: 14
  },
  progressbar: {
    backgroundColor: "#E5E7EB",
    width: 70,
    height: 8,
    marginTop: 5,
    borderRadius: 10,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.APP_PRIMARY,
    borderRadius: 10
  }
})
