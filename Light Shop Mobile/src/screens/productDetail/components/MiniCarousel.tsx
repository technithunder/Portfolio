import {View} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import {Images} from '../../../constants';
import {TouchableImage} from '../../../components';
import {Pagination} from '../../home/components';
import {PaginationProps} from '../../home/types';
import {colors} from '../../../theme';

const MiniCarousel: FC<PaginationProps> = props => {
  const {item} = props;
  return (
    <View>
      <TouchableImage
        source={{uri: item}}
        imageStyle={styles.carouselImageStyle}
        style={styles.carouselImageContainer}
      />
    </View>
  );
};

export default MiniCarousel;
