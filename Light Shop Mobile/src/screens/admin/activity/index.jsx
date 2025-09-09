import React from 'react'
import { View, Text } from 'react-native'
//relative path imports
import styles from './style'
import { Images } from '../../../constants'
import { Container } from '../../../components'

const Activity = () => {
  return (
    <Container
      title="Activity"
      rightIcon={Images.filter}
      leftIcon={Images.back}
      leftContainerStyle={{}}
      >
      <Text>Activity</Text>
    </Container>
  )
}

export default Activity