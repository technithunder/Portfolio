import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  DeviceEventEmitter,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {colors, commonSty} from '../../theme';
import Typography from '../Typo';
import {Images} from '../../constants';

const SHOW_GLOBAL_MODAL = 'show_global_modal';
const HIDE_GLOBAL_MODAL = 'hide_global_modal';

export function showGlobalModal(prop) {
  DeviceEventEmitter.emit(SHOW_GLOBAL_MODAL, prop);
}

export function hideGlobalModal(key?: any) {
  DeviceEventEmitter.emit(HIDE_GLOBAL_MODAL, key);
}

const CustomModal = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState(false);

  const [modalProps, setModalProps] = useState<any>({
    message: '',
  });

  useEffect(() => {
    const showSub = DeviceEventEmitter.addListener(SHOW_GLOBAL_MODAL, prop => {
      setIsVisible(true);
      setMessage(prop?.message);
      setTitle(prop?.title);
      setModalProps(prop);
    });
    const hideSub = DeviceEventEmitter.addListener(HIDE_GLOBAL_MODAL, key => {
      setIsVisible(false);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const onModalHide = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
    } else {
      onModalHide();
    }
  }, [isVisible]);

  const handleMainClose = e => {
    hideGlobalModal();
    if (!!modalProps?.onOkayClicked) {
      modalProps?.onOkayClicked();
    }
  };

  const handleCancelClicked = () => {
    hideGlobalModal();
    if (!!modalProps?.onCancelClicked) {
      modalProps?.onCancelClicked();
    }
  };
  const handleExitClick = () => {
    hideGlobalModal();
    if (!!modalProps?.onExitClicked) {
      modalProps?.onExitClicked();
    }
  };

  return (
    <>
      <Modal
        visible={modalVisible}
        transparent
        onRequestClose={hideGlobalModal}
        style={{zIndex: 99999}}>
        <View style={localStyles.container}>
          <View style={localStyles.modal}>
            <View style={[commonSty.rowStart]}>
              <Image source={Images.logo} style={commonSty.size(24)} />
              <Typography ml={10} color={colors.primary}>
                {title}
              </Typography>
            </View>
            <Typography color={colors.black} align={'left'} size={16} mv={15}>
              {message}
            </Typography>
            {!!modalProps.showCancel ? (
              <View style={[commonSty.rowEnd]}>
                <TouchableOpacity
                  style={[localStyles.button, commonSty.mr30]}
                  onPress={handleCancelClicked}>
                  <Typography color={colors.englishWalnut} align={'right'}>
                    Cancel
                  </Typography>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[localStyles.button]}
                  onPress={handleMainClose}>
                  <Typography color={colors.black} align={'right'}>
                    Okay
                  </Typography>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[localStyles.button]}
                onPress={handleMainClose}>
                <Typography color={colors.red} align={'right'}>
                  Okay
                </Typography>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(10),
    ...commonSty.pv15,
    ...commonSty.ph20,
    width: '85%',
  },
  message: {
    marginVertical: moderateScale(10),
    ...commonSty.pv10,
    ...commonSty.ml10,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...commonSty.mt20,
  },
  button: {},
  cancelButton: {
    borderColor: colors.osloGrey,
    borderWidth: 1,
    backgroundColor: colors.white,
  },
});

export default CustomModal;
