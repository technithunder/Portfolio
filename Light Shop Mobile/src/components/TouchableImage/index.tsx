import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import React, {FC, memo} from 'react';
import FastImage from 'react-native-fast-image';

interface TouchableImageProps extends TouchableOpacityProps {
  source: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  tintColor?: string;
}

const TouchableImage: FC<TouchableImageProps> = props => {
  const {source, imageStyle, resizeMode, tintColor} = props;
  return (
    <TouchableOpacity {...props} activeOpacity={0.7}>
      <FastImage
        source={source as any}
        style={imageStyle as {}}
        resizeMode={resizeMode ?? 'contain'}
        tintColor={tintColor}
      />
    </TouchableOpacity>
  );
};

export default memo(TouchableImage);
