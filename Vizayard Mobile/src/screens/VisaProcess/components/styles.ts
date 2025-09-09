import {StyleSheet} from 'react-native';
import {commonSty} from '../../../theme';
import {COLORS} from '../../../config/colors';

const stepsIcon = (stepStatus: string) => ({
  ...commonSty.size(23),
  tintColor:
    stepStatus === 'finished'
      ? COLORS.APP_WHITE
      : stepStatus === 'current'
      ? COLORS.APP_PRIMARY_MAIN
      : COLORS.APP_WHITE,
  padding: 2,
});

const styles = StyleSheet.create({
  stepsIcon: stepsIcon as any,
});

export default styles;
