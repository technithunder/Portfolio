import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Keyboard,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
  KeyboardController,
} from 'react-native-keyboard-controller';
import styles from './style';
import {useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {
  addNotes,
  addNotesComplaints,
  addNotesOrder,
  getAllNotes,
  getAllNotesComplaints,
  getAllNotesOrder,
} from '../../../api';
import {COLORS} from '../../../theme/colors';
import {Routes} from '../../../constants';

const ManageNote = ({navigation}) => {
  const route = useRoute();
  const id = route?.params?.id;
  const isOrder = route?.params?.isOrder;
  const isLead = route?.params?.isLead;
  const isComplaints = route?.params?.isComplaints;
  const isTodayLead = route?.params?.isTodayLead;
  const isTodayOrder = route?.params?.isTodayOrder;

  console.log('ManageNote params:', {
    id,
    isOrder,
    isLead,
    isComplaints,
    isTodayOrder,
    isTodayLead,
  });

  const user = useSelector(state => state.auth.user);
  const scrollViewRef = useRef(null);
  const textInputRef = useRef(null);
  const scrollViewContentHeight = useRef(0);
  const scrollViewHeight = useRef(0);
  const previousScrollY = useRef(0);

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sendingNote, setSendingNote] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [error, setError] = useState(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isScrollingToBottom, setIsScrollingToBottom] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        console.log('Keyboard shown:', event.endCoordinates.height);
        setIsKeyboardVisible(true);
        setKeyboardHeight(event.endCoordinates.height);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({animated: true});
        }, 100);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        console.log('Keyboard hidden');
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  useEffect(() => {
    if (id && (isOrder || isLead || isComplaints || isTodayOrder || isTodayLead)) {
      fetchAllNotes(1, true);
    } else {
      Alert.alert('Error', 'Invalid parameters provided');
      navigation.goBack();
    }
  }, [id, isOrder, isLead, isComplaints]);

  const handleScroll = event => {
    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent;
    const scrollY = contentOffset.y;

    scrollViewContentHeight.current = contentSize.height;
    scrollViewHeight.current = layoutMeasurement.height;
    previousScrollY.current = scrollY;

    const threshold = 100;
    if (
      scrollY <= threshold &&
      !loadingMore &&
      hasMoreData &&
      currentPage < totalPages
    ) {
      console.log('Near top, loading more data...');
      loadMoreNotes();
    }
  };

  const fetchAllNotes = async (
    page = 1,
    isInitialLoad = false,
    isLoadMore = false,
  ) => {
    try {
      setError(null);

      if (isInitialLoad) {
        setLoading(true);
      } else if (isLoadMore) {
        setLoadingMore(true);
      }

      const response = isComplaints
        ? await getAllNotesComplaints(page, pageSize, id)
        : isOrder
        ? await getAllNotesOrder(page, pageSize, id)
        : await getAllNotes(page, pageSize, id);

      if (response?.data?.status === 'success') {
        const apiData = response?.data?.data;

        const paginationInfo = {
          total: apiData.total || 0,
          page: apiData.page || 1,
          pageSize: apiData.pageSize || pageSize,
        };

        let processedMessages = [];

        if (isOrder && apiData?.orders) {
          processedMessages = apiData.orders.map(note => ({
            id: note.id,
            text: note.note,
            isUser: note.User?.id === user?.id,
            timestamp: new Date(note.createdAt),
            userName:
              `${note.User?.firstName || ''} ${
                note.User?.lastName || ''
              }`.trim() || 'Unknown User',
            userRole: note.User?.role || 'user',
            noteData: {
              orderId: note.orderId,
              userId: note.userId,
              user: note.User,
              createdAt: note.createdAt,
              updatedAt: note.updatedAt,
            },
          }));
        } else if (isLead && apiData?.leads) {
          processedMessages = apiData.leads.map(note => ({
            id: note.id,
            text: note.note,
            isUser: note.User?.id === user?.id,
            timestamp: new Date(note.createdAt),
            userName:
              `${note.User?.firstName || ''} ${
                note.User?.lastName || ''
              }`.trim() || 'Unknown User',
            userRole: note.User?.role || 'user',
            noteData: {
              leadId: note.leadId,
              userId: note.userId,
              user: note.User,
              createdAt: note.createdAt,
              updatedAt: note.updatedAt,
            },
          }));
        } else if (isComplaints && apiData?.leads) {
          processedMessages = apiData.leads.map(note => ({
            id: note.id,
            text: note.note,
            isUser: note.User?.id === user?.id,
            timestamp: new Date(note.createdAt),
            userName:
              `${note.User?.firstName || ''} ${
                note.User?.lastName || ''
              }`.trim() || 'Unknown User',
            userRole: note.User?.role || 'user',
            noteData: {
              complaintId: note.complaintId,
              userId: note.userId,
              user: note.User,
              createdAt: note.createdAt,
              updatedAt: note.updatedAt,
            },
          }));
        }

        const sortedMessages =
          processedMessages?.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
          ) || [];

        setTotalNotes(paginationInfo.total);
        setCurrentPage(paginationInfo.page);
        setTotalPages(
          Math.ceil(paginationInfo.total / paginationInfo.pageSize),
        );
        setPageSize(paginationInfo.pageSize);

        if (isInitialLoad || page === 1) {
          setMessages([...sortedMessages]);
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({animated: false});
          }, 100);
        } else if (isLoadMore) {
          const currentScrollY = previousScrollY.current;
          const currentContentHeight = scrollViewContentHeight.current;

          setMessages(prev => [...sortedMessages, ...prev]);

          setTimeout(() => {
            const newContentHeight = scrollViewContentHeight.current;
            const scrollOffset =
              newContentHeight - currentContentHeight + currentScrollY;

            scrollViewRef.current?.scrollTo({
              y: scrollOffset,
              animated: false,
            });
          }, 50);
        }

        setHasMoreData(
          paginationInfo.page <
            Math.ceil(paginationInfo.total / paginationInfo.pageSize),
        );

        console.log('Notes loaded successfully:', {
          page: paginationInfo.page,
          total: paginationInfo.total,
          notesCount: sortedMessages.length,
          hasMore:
            paginationInfo.page <
            Math.ceil(paginationInfo.total / paginationInfo.pageSize),
        });
      } else {
        throw new Error(response?.data?.message || 'Failed to fetch notes');
      }
    } catch (e) {
      setError(e.message || 'Failed to load notes');

      if (isInitialLoad) {
        Alert.alert('Error', 'Failed to load notes. Please try again.');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const loadMoreNotes = () => {
    if (!loadingMore && hasMoreData && currentPage < totalPages) {
      const nextPage = currentPage + 1;
      console.log('Loading more notes, page:', nextPage);
      fetchAllNotes(nextPage, false, true);
    }
  };

  const onRefresh = () => {
    console.log('Refreshing notes');
    setRefreshing(true);
    setCurrentPage(1);
    fetchAllNotes(1, true);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || sendingNote) {
      return;
    }

    const messageText = inputText.trim();

    const tempMessage = {
      id: `temp_${Date.now()}`,
      text: messageText,
      isUser: true,
      timestamp: new Date(),
      userName:
        `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'You',
      userRole: user?.role || 'user',
      noteData: {
        ...(isComplaints
          ? {complaintId: id}
          : isOrder
          ? {orderId: id}
          : {leadId: id}),
        userId: user?.id,
        createdAt: new Date().toISOString(),
      },
    };

    setInputText('');
    setMessages(prev => [...prev, tempMessage]);

    setIsScrollingToBottom(true);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
      setIsScrollingToBottom(false);
    }, 100);

    setSendingNote(true);

    try {
      const requestData = {
        ...(isComplaints
          ? {complaintId: id}
          : isOrder
          ? {orderId: id}
          : {leadId: id}),
        userId: user?.id,
        note: messageText,
      };

      console.log('Sending note:', requestData);

      const response = isComplaints
        ? await addNotesComplaints(requestData)
        : isOrder
        ? await addNotesOrder(requestData)
        : await addNotes(requestData);

      console.log('Note sent response:', response?.data);

      if (response?.data?.status === 'success') {
        const realMessage = {
          id: response?.data?.data?.id || tempMessage.id,
          text: messageText,
          isUser: true,
          timestamp: new Date(response?.data?.data?.createdAt || new Date()),
          userName: tempMessage.userName,
          userRole: tempMessage.userRole,
          noteData: {
            ...(isComplaints
              ? {complaintId: id}
              : isOrder
              ? {orderId: id}
              : {leadId: id}),
            userId: user?.id,
            createdAt:
              response?.data?.data?.createdAt || new Date().toISOString(),
          },
        };

        setMessages(prev =>
          prev.map(msg => (msg.id === tempMessage.id ? realMessage : msg)),
        );
      } else {
        throw new Error(response?.data?.message || 'Failed to send note');
      }
    } catch (e) {
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      Alert.alert('Error', 'Failed to send note. Please try again.');
    } finally {
      setSendingNote(false);
    }
  };

  const handleSubmitEditing = () => {
    if (inputText.trim() && !sendingNote) {
      sendMessage();
    }
  };

  const handleInputFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 300);
  };

  const forceFocus = () => {
    textInputRef.current?.focus();
  };

  const formatDate = date => {
    const messageDate = new Date(date);

    const day = messageDate.getDate();
    const month = messageDate.toLocaleDateString('en-US', {month: 'short'});
    const year = messageDate.getFullYear();

    let hour = messageDate.getHours();
    const minute = messageDate.getMinutes().toString().padStart(2, '0');

    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;

    return `${day} ${month}, ${year} ${hour}:${minute} ${ampm}`;
  };

  const renderMessage = message => (
    <View
      key={message.id}
      style={[
        styles.messageWrapper,
        message.isUser
          ? styles.userMessageWrapper
          : styles.systemMessageWrapper,
      ]}>
      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userMessage : styles.systemMessage,
        ]}>
        <Text
          style={[
            styles.userName,
            message.isUser ? styles.userNameText : styles.systemUserNameText,
            {
              color:
                message?.userRole === 'admin'
                  ? message.isUser
                    ? COLORS.APP_WHITE
                    : COLORS.APP_GREEN
                  : message.isUser
                  ? COLORS.APP_WHITE
                  : COLORS.APP_PRIMARY,
            },
          ]}>
          {message.userName} {message.userRole && `(${message.userRole})`}
        </Text>

        <Text
          style={[
            styles.messageText,
            message.isUser ? styles.userMessageText : styles.systemMessageText,
          ]}>
          {message.text}
        </Text>

        <Text
          style={[
            styles.timestamp,
            message.isUser ? styles.userTimestamp : styles.systemTimestamp,
          ]}>
          {formatDate(message.timestamp)}
        </Text>
      </View>
    </View>
  );

  const renderLoadingIndicator = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.loadingMoreIndicator}>
        <ActivityIndicator size="small" color={COLORS.APP_PRIMARY} />
      </View>
    );
  };

  const onBack = () => {
    try {
      if (KeyboardController?.dismiss) {
        KeyboardController.dismiss();
      } else {
        Keyboard.dismiss();
      }
    } catch (error) {
      console.log('Error dismissing keyboard:', error);
      Keyboard.dismiss();
    }

    if (isLead) {
      navigation.navigate(Routes.ViewLead, {id});
    } else if (isOrder) {
      navigation.navigate(Routes.ViewOrder, {id});
    } else if (isTodayLead) {
      navigation.navigate(Routes.ViewAdminTodayLead);
    } else if (isTodayOrder) {
      navigation.navigate(Routes.ViewAdminTodayOrder);
    } else {
      navigation.goBack();
    }
  };

  const getHeaderTitle = () => {
    if (isOrder) return 'Order Notes';
    if (isLead) return 'Lead Notes';
    if (isComplaints) return 'Complaint Notes';
    if(isTodayLead) return `Lead Notes`
    if(isTodayOrder) return `Order Notes`
    return 'Notes';
  };

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    scrollViewContentHeight.current = contentHeight;

    if (messages.length > 0 && !loadingMore && !isScrollingToBottom) {
      const isNearBottom =
        previousScrollY.current + scrollViewHeight.current >=
        scrollViewContentHeight.current - 100;

      if (isNearBottom) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({animated: true});
        }, 100);
      }
    }
  };

  const handleLayout = event => {
    scrollViewHeight.current = event.nativeEvent.layout.height;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
          <View style={styles.menuButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.APP_PRIMARY} />
          <Text style={styles.loadingText}>Loading notes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && messages.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
          <TouchableOpacity onPress={() => fetchAllNotes(1, true)}>
            <Ionicons name="refresh" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchAllNotes(1, true)}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}>
        <View style={styles.chatContainer}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={[
              styles.messagesContent,
              {
                paddingBottom: 20,
                flexGrow: 1,
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onContentSizeChange={handleContentSizeChange}
            onLayout={handleLayout}>
            {renderLoadingIndicator()}

            {messages.map(renderMessage)}

            {/* End of messages indicator
            {!hasMoreData && messages.length > 0 && (
              <View style={styles.endMessage}>
                <Text style={styles.endMessageText}>
                  Beginning of conversation
                </Text>
              </View>
            )} */}

            {messages.length === 0 && !loading && (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={64} color="#ccc" />
                <Text style={styles.emptyStateText}>
                  No notes yet. Start a conversation!
                </Text>
                {/* <TouchableOpacity
                  onPress={forceFocus}
                  style={{
                    marginTop: 10,
                    padding: 10,
                    backgroundColor: COLORS.APP_PRIMARY,
                    borderRadius: 5,
                  }}>
                  <Text style={{color: 'white'}}>Focus Input (Debug)</Text>
                </TouchableOpacity> */}
              </View>
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={textInputRef}
                style={styles.textInput}
                placeholder={`Add a note for this ${
                  isComplaints ? 'complaint' : isOrder ? 'order' : 'lead'
                }...`}
                placeholderTextColor="#999"
                value={inputText}
                onChangeText={setInputText}
                multiline={true}
                maxLength={1000}
                editable={!sendingNote}
                returnKeyType="send"
                blurOnSubmit={false}
                onSubmitEditing={handleSubmitEditing}
                onFocus={handleInputFocus}
                autoCorrect={true}
                keyboardType="default"
                textContentType="none"
                autoCapitalize="sentences"
                autoFocus={false}
                showSoftInputOnFocus={true}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  inputText.trim()
                    ? styles.sendButtonActive
                    : styles.sendButtonInactive,
                ]}
                onPress={sendMessage}
                disabled={!inputText.trim() || sendingNote}
                activeOpacity={0.7}>
                {sendingNote ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons
                    name="send"
                    size={20}
                    color={inputText.trim() ? '#fff' : '#999'}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ManageNote;
