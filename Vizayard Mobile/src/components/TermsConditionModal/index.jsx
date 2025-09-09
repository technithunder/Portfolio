import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {COLORS} from '../../config/colors';
import {Button, Icon, Typography} from '../../components';
import {verticalScale, scale} from 'react-native-size-matters';
import {FONTS} from '../../config/font';

const TermsConditionModal = ({visible, onClose, onAccept,setAcceptedTerms,acceptedTerms}) => {
  

  const handleAccept = () => {
    if (acceptedTerms) {
      onAccept();
      onClose();
    }
  };

  const toggleAcceptTerms = () => {
    setAcceptedTerms(!acceptedTerms);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Typography
              title="Terms & Conditions"
              size={18}
              font={FONTS.INTER_SEMIBOLD}
            />

            <Icon
              icon="AntDesign"
              name="close"
              onPress={onClose}
              size={24}
              color={COLORS.BLACK}
            />
          </View>

          <ScrollView style={styles.termsContent}>
            <Typography
              title="Please read the following terms and conditions carefully:"
              size={14}
              font={FONTS.INTER_REGULAR}
              mb={10}
            />

            <Typography
              title="1. Payment Terms"
              size={16}
              mb={5}
              font={FONTS.INTER_SEMIBOLD}
            />
            <Typography
              title="By proceeding with this payment, you agree to pay the full amount as specified. All payments are processed securely through our payment gateway."
              size={14}
              mb={10}
              font={FONTS.INTER_REGULAR}
            />

            <Typography
              title="2. Cancellation Policy"
              size={16}
              mb={5}
              font={FONTS.INTER_SEMIBOLD}
            />
            <Typography
              title="Cancellation terms vary based on the visa type and timing. Please review our complete cancellation policy on our website for detailed information."
              size={14}
              mb={10}
              font={FONTS.INTER_REGULAR}
            />

            <Typography
              title="3. Refund Policy"
              size={16}
              mb={5}
              font={FONTS.INTER_SEMIBOLD}
            />
            <Typography
              title="Refunds will be processed according to our refund policy and the options you've selected during checkout. Processing time for refunds may vary depending on your payment method and financial institution."
              size={14}
              mb={10}
              font={FONTS.INTER_REGULAR}
            />

            <Typography
              title="4. Visa Processing"
              size={16}
              mb={5}
              font={FONTS.INTER_SEMIBOLD}
            />
            <Typography
              title="We cannot guarantee visa approval as final decisions are made by the respective embassy or consulate. Our service covers assistance with the application process only."
              size={14}
              mb={10}
              font={FONTS.INTER_REGULAR}
            />

            <Typography
              title="5. Personal Information"
              size={16}
              mb={5}
              font={FONTS.INTER_SEMIBOLD}
            />
            <Typography
              title="By proceeding, you authorize us to use your personal information for visa processing purposes and share it with relevant authorities as required."
              size={14}
              font={FONTS.INTER_REGULAR}
              mb={20}
            />
          <View style={styles.checkboxContainer}>
            <Icon
              icon="MaterialCommunityIcons"
              name={
                acceptedTerms ? 'checkbox-marked' : 'checkbox-blank-outline'
              }
              color={COLORS.APP_PRIMARY_MAIN}
              size={24}
              onPress={toggleAcceptTerms}
            />
            <Typography
              title={`I have read and agree to the terms \n and conditions`}
              size={14}
              ml={10}
            />
          </View>

          <View>
            <Button
              title="Accept & Continue"
              onPress={handleAccept}
              disabled={!acceptedTerms}
            />
          </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.APP_COMMON_WHITE,
    width: '90%',
    borderRadius: 10,
    maxHeight: '90%',
    padding: scale(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  closeButton: {
    padding: scale(5),
  },
  termsContent: {
    marginVertical: verticalScale(15),
    maxHeight: verticalScale(450),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
 
});

export default TermsConditionModal;
