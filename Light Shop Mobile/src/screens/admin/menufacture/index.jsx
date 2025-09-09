import React from 'react'
import { View, Text } from 'react-native'
//relative path imports
import styles from './style'
import { Images } from '../../../constants'
import { Container } from '../../../components'

const Manufacture = () => {
  return (
    <Container
      title="Manufacture"
      rightIcon={Images.filter}
      leftIcon={Images.back}
      leftContainerStyle={{}}
      >
      <Text>Manufacture</Text>
    </Container>
  )
}

export default Manufacture