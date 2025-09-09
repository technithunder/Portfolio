import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {FONTS} from '../../../../../constants/fonts';
import {COLORS} from '../../../../../theme/colors';
import {Typography} from '../../../../../components';

const NoteModal = ({visible, onClose, onSubmit, notes}) => {
  const [note, setNote] = useState('');

  useEffect(() => {
    if (notes) {
      setNote(notes);
    }
  }, [notes]);
  const isFormValid = () => {
    return note.trim() !== '';
  };

  const onSave = () => {
    if (!isFormValid()) {
      return;
    }

    let obj = {
      notes: note,
    };
    onSubmit(obj);
    onClose();
    setNote('');
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent={true}
      animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={e => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>{notes ? 'Edit Note' : 'Add Note'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <View>
              <Typography title={'Note'} size={14} font={FONTS.INTER_MEDIUM} />
              <TextInput
                placeholder="Enter Note"
                placeholderTextColor={COLORS.APP_GRAY}
                style={styles.input}
                multiline
                numberOfLines={2}
                onChangeText={setNote}
                value={note}
              />
            </View>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                !isFormValid() && styles.disabledButton,
              ]}
              onPress={onSave}
              disabled={!isFormValid()}>
              <Text
                style={[
                  styles.submitText,
                  !isFormValid() && styles.disabledText,
                ]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  container: {
    width: '95%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  content: {
    padding: 10,
    minHeight: 200,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    padding: 12,
    marginLeft: 10,
    backgroundColor: COLORS.APP_PRIMARY,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },

  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  disabledText: {
    color: '#666666',
  },
  input: {
    minHeight: 180,
    height: 'auto',
    borderColor: COLORS.APP_GRAY,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_REGULAR,
    textAlignVertical: 'top',
  },
});

export default NoteModal;
