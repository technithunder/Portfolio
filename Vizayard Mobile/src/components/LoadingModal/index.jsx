import React, {memo, useEffect, useState} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';
import {commonSty} from '../../theme';
import {moderateScale} from 'react-native-size-matters';
import {Images} from '../../config';
import FastImage from 'react-native-fast-image';

const LoadingModal = ({isVisible, step}) => {
  const [showLoader, setShowLoader] = useState(false);
  useEffect(() => {
    let timer;
    if (isVisible) {
      timer = setTimeout(() => {
        setShowLoader(true);
      }, 100);
    } else {
      setShowLoader(false); // Reset immediately when modal hides
    }

    return () => clearTimeout(timer);
  }, [isVisible]);
  const isFirstStep = step === 0;
  return (
    <Modal transparent={true} visible={isVisible}>
      <View style={commonSty.modalContainer}>
        {showLoader && (
          <View style={styles.loaderContainer}>
            <Text style={styles.txtQualityText}>
              Performing quality checks on
            </Text>
            <View>
              <FastImage
                resizeMode="contain"
                style={[commonSty.size(120)]}
                source={
                  isFirstStep ? Images.scanner_loading : Images.docs_scanner
                }
              />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default memo(LoadingModal);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loaderContainer: {
    width: '80%',
    height: moderateScale(200),
    backgroundColor: '#fff',
    borderRadius: moderateScale(10),
    paddingTop: 20,
    alignItems: 'center',
  },
  successIcon: {
    height: 120,
    width: 120,
  },
  txtQualityText: {
    color: COLORS.APP_BLACK,
    fontSize: 18,
    fontFamily: FONTS.INTER_SEMIBOLD,
  },
});
