import React, { Component } from 'react'
import {
  Text, View, TouchableOpacity, Keyboard, ActivityIndicator, Alert
} from 'react-native'
import { Layout } from '@ui-kitten/components';
import messaging from '@react-native-firebase/messaging';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
//styles
import styles from './style'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux';

import Promises from '../../helper/Promises';
import { getChat, sendMessage, getChatFromNotification } from '../../redux/actions/chat';
import Axios from 'axios';
import { BASE_URL, createHeaders } from '../../helper/constants';

class Chat extends Component {
  state = {
    name: '',
    message: '',
    isKeyboardOpen: false,
    token: '',
    isLoading: false,
    FriendId: ''
  }

  /*
  .##........#######...######...####..######.
  .##.......##.....##.##....##...##..##....##
  .##.......##.....##.##.........##..##......
  .##.......##.....##.##...####..##..##......
  .##.......##.....##.##....##...##..##......
  .##.......##.....##.##....##...##..##....##
  .########..#######...######...####..######.
  */

  componentDidMount = async() => {
    global.page = 'chat'
    const data = this.props.route.params.data
    const token = await Promises.getUserToken();
    this.setState({ name: data.FriendName, token, FriendId: data.FriendId, conversationId: data.conversationId })
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    this.loadMessages(data.conversationId, token);
    this.unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const messages = JSON.parse(remoteMessage.data.data);
      if (remoteMessage.data.type === 'chat') {
        this.props.getChatFromNotification(messages.messageDetail)
      }
    });
  }

  componentWillUnmount = () => {
    this.unsubscribe()
  }

  loadMessages = async (conversationId, token) => {
    this.setState({ isLoading: true })
    this.props.getChat(token, conversationId)
      .then(() => {
        this.setState({ isLoading: false });
      });
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({ isKeyboardOpen: true });
  }

  _keyboardDidHide = () => {
    this.setState({ isKeyboardOpen: false });
  }

  sendMessages = async(messages) => {
    const { token, conversationId, FriendId } = this.state;
    const { UserId, FirstName } = this.props.user;
    messages.forEach((message) => {
      this.props.sendMessage(UserId, token, FirstName, conversationId, message.text, FriendId);
    });
  }

  onVideoPress = async() => {
    const userId = await Promises.getUsersKey();
    const token = await Promises.getUserToken();
    const obj = {
      UserId: userId,
      ReceivedUserId: this.state.FriendId,
      IsJoinCall: true
    }

    Axios.post(`${BASE_URL}User/FriendVideoCall`, obj, { headers: createHeaders(token) })
      .then(res => {
        const { data } = res.data;
        Alert.alert(`Please wait for ${this.state.name} to accept call request`);
      })
      .catch(err => {
        console.log(err)
        this.setState({ continueLoader: false })
      })
  }

  /*
  ..######...#######..##.....##.########...#######..##....##.########.##....##.########
  .##....##.##.....##.###...###.##.....##.##.....##.###...##.##.......###...##....##...
  .##.......##.....##.####.####.##.....##.##.....##.####..##.##.......####..##....##...
  .##.......##.....##.##.###.##.########..##.....##.##.##.##.######...##.##.##....##...
  .##.......##.....##.##.....##.##........##.....##.##..####.##.......##..####....##...
  .##....##.##.....##.##.....##.##........##.....##.##...###.##.......##...###....##...
  ..######...#######..##.....##.##.........#######..##....##.########.##....##....##...
  */

  render() {
    return (
      this.renderMainView()
    )
  }

  renderMainView = () => {
    const { isLoading } = this.state;
    return (
      <Layout style={styles.container}>
            {this.renderHeader()}
            {isLoading ? <ActivityIndicator color="#000"/> : (
              <GiftedChat
              messages={this.props.messages}
              styles={chatStyles.container}
              onSend={messages => this.sendMessages(messages)}
              renderBubble={this.renderBubble}
              renderChatEmpty={renderEmptyChatMessage}
              renderUsernameOnMessage={true}
              user={{
                _id: this.props.user.UserId
              }}
            />
            )}
      </Layout>
    )
  }

  renderBubble = (props) =>
    (<Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#8CD790',
        },
      }} />);

  renderHeader = () => {
    return (
      <View style={styles.headerMain}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <AntDesign name="arrowleft" size={35} color="darkgrey" />
          </TouchableOpacity>
          <View style={{ paddingLeft: 20 }}>
            <Text style={styles.txtusername}>{this.state.name}</Text>
            <Text style={styles.activenow}>Active now</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={this.onVideoPress} style={{ marginLeft: 20 }}>
            <Ionicons name="videocam-outline" size={26} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const renderEmptyChatMessage = (props) =>
  (<View style={chatStyles.emptyMessageContainer}><Text>No messages have been sent yet.</Text></View>)

const convertMessagesToGiftedFormat = (messages, user) => {
  const { UserId } = user;
  return messages && messages.map((msg) => {
    if (msg.chatOwnerId == UserId) {
      return {
        _id: msg.MessageId,
        text: msg.Message,
        createdAt: (msg.Message_datetime && msg.Message_datetime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })),
        user: {
          _id: UserId,
        },
        image: '',
        system: false
      };
    } else {
      return {
        _id: msg.MessageId,
        text: msg.Message,
        createdAt: msg.Message_datetime && msg.Message_datetime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
        user: {
          _id: msg.SenderId,
          avatar: msg.SenderPicture
        },
        system: false
      }
    }
  }
  )
};

const chatStyles = {
  emptyMessageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotateX: '180deg' }]
  },
  container: {
    backgroundColor: 'white'
  },
  chatContainer: {
    flex: 1,
    backgroundColor: 'white'
  }
}


const mapStateToProps = (state) => {
  let conversations = state.chat.conversations[state.chat.currentConversationId];
  if (!conversations) {
    return {
      user: state.users.userData,
    }
  }
  return {
    user: state.users.userData,
    messages: convertMessagesToGiftedFormat(conversations.messages, state.users.userData),
  }
};

export default connect(mapStateToProps, {getChat, getChatFromNotification, sendMessage})(Chat);