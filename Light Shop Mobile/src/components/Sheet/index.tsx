import React, {ReactNode, forwardRef, memo} from 'react';
import ActionSheet, {
  ActionSheetProps,
  ActionSheetRef,
} from 'react-native-actions-sheet';
import styles from './styles';
import {View} from 'react-native';

interface SheetProps extends ActionSheetProps {
  children?: ReactNode;
}

const Sheet = forwardRef<ActionSheetRef, SheetProps>(
  ({children, ...props}, ref) => {
    return (
      <ActionSheet
        containerStyle={styles.mainContainer}
        ref={ref}
        {...props}
        headerAlwaysVisible
        CustomHeaderComponent={<View style={styles.header} />}
        gestureEnabled>
        {children}
      </ActionSheet>
    );
  },
);

Sheet.displayName = 'Sheet';

export default memo(Sheet);
