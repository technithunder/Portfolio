import React, {FC} from 'react';
import StepIndicator from 'react-native-step-indicator';
import {moderateScale} from 'react-native-size-matters';
import {COLORS} from '../../../config/colors';
import {FONTS} from '../../../config/font';
import styles from './styles';
import {Typography} from '../../../components';
import {Images} from '../../../config';
import {Image, TouchableOpacity, View} from 'react-native';
interface IndicatorProps {
  currentPosition: number;
  onPress: (ind: number) => void;
}

const Indicator: FC<IndicatorProps> = props => {
  const {currentPosition, onPress} = props;
  const travelLabel = ['Photo', 'Passport', 'Details', 'Documents'];

  const JobIcon = (position: number) => {
    const icons = [
      Images.photo,
      Images.scanner,
      Images.detail,
      Images.documents,
    ];
    return icons[position] || Images.detail;
  };

  // const handlePress = (position: number) => {
  //   if (!!onPress) {
  //     onPress(position);
  //   }
  // };

  const getStepIcon = (position: number, stepStatus: string) => {
    switch (position) {
      case 0:
        return (
          <View>
            <Image
              source={JobIcon(position)}
              resizeMode="contain"
              style={[styles.stepsIcon(stepStatus)]}
            />
          </View>
        );
      case 1:
        return (
          <View>
            <Image
              source={JobIcon(position)}
              resizeMode="contain"
              style={[styles.stepsIcon(stepStatus)]}
            />
          </View>
        );
      case 2:
        return (
          <View>
            <Image
              source={JobIcon(position)}
              resizeMode="contain"
              style={[styles.stepsIcon(stepStatus)]}
            />
          </View>
        );
      case 3:
        return (
          <View>
            <Image
              source={JobIcon(position)}
              resizeMode="contain"
              style={[styles.stepsIcon(stepStatus)]}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const CommonStyle = {
    labelFontFamily: FONTS.INTER_MEDIUM,
    stepStrokeWidth: 2,
    stepIndicatorSize: moderateScale(45),
    currentStepIndicatorSize: moderateScale(45),
    stepIndicatorFinishedColor: COLORS.APP_PRIMARY_MAIN,
    stepIndicatorUnFinishedColor: COLORS.APP_PRIMARY_MAIN,
    stepIndicatorCurrentColor: COLORS.APP_WHITE,
    stepStrokeFinishedColor: COLORS.APP_PRIMARY_MAIN,
    stepStrokeUnFinishedColor: COLORS.APP_PRIMARY_MAIN,
    stepStrokeCurrentColor: COLORS.APP_PRIMARY_MAIN,
    currentStepStrokeWidth: moderateScale(2),
    separatorUnFinishedColor: COLORS.APP_PRIMARY_MAIN,
    separatorFinishedColor: COLORS.APP_PRIMARY_MAIN,
    separatorStrokeWidth: moderateScale(3),
    separatorMarginX: moderateScale(30),
  };

  return (
    <StepIndicator
      labels={travelLabel}
      stepCount={travelLabel.length}
      customStyles={CommonStyle}
      currentPosition={currentPosition}
      renderStepIndicator={({position, stepStatus}) => {
        return getStepIcon(position, stepStatus);
      }}
      renderLabel={({position, stepStatus}) => {
        return (
          <Typography
            title={travelLabel[position]}
            size={12}
            align="center"
            mt={3}
            color={COLORS.APP_BLACK}
          />
        );
      }}
    />
  );
};

export default Indicator;
