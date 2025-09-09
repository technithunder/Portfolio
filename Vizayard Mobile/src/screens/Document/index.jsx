import React from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
//relative path imports
import styles from './style';
import {Container, Icon, Typography} from '../../components';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';
import USER from '../../../assets/images/explore/user.png';

const data = [
  {
    image: USER,
    name: 'Noah Flynn',
    relation: 'Sister',
  },
  {
    image: USER,
    name: 'Noah Flynn',
    relation: 'Sister',
  },
  {
    image: USER,
    name: 'Noah Flynn',
    relation: 'Sister',
  },
  {
    image: USER,
    name: 'Noah Flynn',
    relation: 'Sister',
  },
];

const Documents = ({navigation}) => {
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("DocumentList",{name:item.name})} style={styles.itemContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Image source={item.image} style={{height: 45, width: 45}} />
          <View>
            <Typography
              title={item.name}
              font={FONTS.INTER_REGULAR}
              size={16}
            />
            <Typography
              title={item.relation}
              font={FONTS.INTER_REGULAR}
              size={14}
              color="#848484"
            />
          </View>
        </View>
        <View style={styles.nextBtnView}>
          <Icon icon='MaterialIcons' name='navigate-next' size={20} color={COLORS.APP_PRIMARY_MAIN}/>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container
      style={{flex: 1, backgroundColor: COLORS.APP_WHITE}}
      title="Documents"
      showBack>
      <FlatList
        data={data}
        renderItem={renderItem}
        contentContainerStyle={{marginHorizontal: 20}}
      />
    </Container>
  );
};

export default Documents;
