// style.js - FIXED VERSION
import {StyleSheet, Dimensions} from 'react-native';
import {COLORS} from '../../../theme/colors';
import {FONTS} from '../../../constants/fonts';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 1,
  },

  backButton: {
    padding: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },

  menuButton: {
    padding: 8,
  },

  // FIXED: Chat Container - Simplified
  chatContainer: {
    flex: 1,
  },

  // FIXED: Messages Area - Better spacing
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  messagesContent: {
    paddingVertical: 16,
    flexGrow: 1,
    // REMOVED: paddingBottom to prevent extra spacing issues
  },

  messageWrapper: {
    marginVertical: 4,
  },

  userMessageWrapper: {
    alignItems: 'flex-end',
  },

  systemMessageWrapper: {
    alignItems: 'flex-start',
  },

  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },

  userMessage: {
    backgroundColor: COLORS.APP_PRIMARY,
    borderBottomRightRadius: 6,
  },

  systemMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  // User Name Styles
  userName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },

  userNameText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },

  systemUserNameText: {
    color: COLORS.APP_PRIMARY,
  },

  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },

  userMessageText: {
    color: '#fff',
  },

  systemMessageText: {
    color: '#333',
  },

  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },

  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },

  systemTimestamp: {
    color: '#999',
  },

  // FIXED: Input Area - Simplified and better keyboard handling
  inputContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    // REMOVED: All positioning properties to prevent spacing issues
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f8f8',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 50,
    maxHeight: 120, // Limit height for multiline input
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 12,
    textAlignVertical: 'center',
    // FIXED: Better line height for consistent spacing
    lineHeight: 22,
  },

  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  sendButtonActive: {
    backgroundColor: COLORS.APP_PRIMARY,
  },

  sendButtonInactive: {
    backgroundColor: '#e0e0e0',
  },

  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },

  // Error states
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 32,
  },

  retryButton: {
    backgroundColor: COLORS.APP_PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },

  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Load More Button
  loadMoreButton: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 16,
    backgroundColor: COLORS.APP_PRIMARY,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },

  loadMoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },

  endMessage: {
    alignSelf: 'center',
    paddingVertical: 16,
  },

  endMessageText: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
  },

  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    minHeight: height * 0.5, // ADDED: Minimum height to center properly
  },

  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },

  // Note Info Styles
  noteInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },

  leadInfo: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 2,
  },

  leadType: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  loadingMoreText: {
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_MEDIUM,
  },
});

export default styles;
