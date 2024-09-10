import React, { Component } from 'react'
import { Text, View, FlatList, Image, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import InviteModal from '../../components/InviteModal';
//styles 
import styles from './style'
import { Layout } from '@ui-kitten/components';
import Promises from '../../helper/Promises'
import Axios from 'axios'
import { connect } from 'react-redux'
import { BASE_URL } from '../../helper/constants'

const createHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `BasicCustom ${token}`,
});

class Message extends Component {

  state = {
    CONVERSATIONS: [],
    isModalVisible: false,
    error: '',
    refreshing: false,
  }

  render() {
    return (
      this.renderMainView()
    )
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

  componentDidMount = () => {
    const { navigation } = this.props;
    //   this.getAllConversations()
    this._focusedScreen = this.props.navigation.addListener('focus', () => {
      this.getAllConversations()
    })
  }

  getAllConversations = async () => {
    const token = await Promises.getUserToken();
    Axios.get(`${BASE_URL}Conversation/GetConversationsByUser?userId=${this.props.user.UserId}`, {
      headers: createHeaders(token),
    })
      .then(res => {
        this.setState({ CONVERSATIONS: res.data.data.conversations, refreshing: false })
      })
      .catch(err => {
        console.log(err)
        this.setState({ refreshing: false })
      })
  }

  _onPressMessageName = (item) => {
    global.page = 'chat'
    this.props.navigation.navigate('Chat', { data: item })
  }

  _deleteUser = (item) => {
    Alert.alert(
      `Delete User`,
      `Are you sure you want to delete your conversation with ${item.FriendName}`,
      [
        { text: 'CANCEL', onPress: () => console.log('Cancel Pressed!') },
        { text: 'DELETE', onPress: () => this.onDeleteBTN(item) },
      ],
      { cancelable: false }
    )
  }

  onDeleteBTN = async (item) => {
    const token = await Promises.getUserToken()
    Axios.get(`${BASE_URL}User/DeleteConversation?conversationId=${item.conversationId}`, {
      headers: createHeaders(token)
    })
      .then(res => {
        this.getAllConversations()
      })
      .catch(err => console.log(err))
  }

  closeModal = async (email) => {
    if (email != null) {
      const token = await Promises.getUserToken()
      const data = {
        userid: this.props.user.UserId,
        username: email
      }
      Axios.post(`${BASE_URL}UserLikeDislike/AddFriend`, data, {
        headers: createHeaders(token)
      })
        .then(res => {
          this.setState({ isModalVisible: false })
          this.getAllConversations()
        })
        .catch(err => console.log(err))
    } else {
      this.setState({ error: '' })
    }
  }

  closeModal1 = () => {
    this.setState({ isModalVisible: false })
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getAllConversations()
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

  renderMainView = () => {
    const { isModalVisible } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {this.renderHeader()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }
        >
          {this.renderMessageList()}
          <InviteModal isModalVisible={isModalVisible} closeModal={this.closeModal} closeModal1={this.closeModal1} />
        </ScrollView>
      </View>
    )
  }

  renderHeader = () => {
    return (
      <View style={styles.headerMain}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.headerBorder} />
          <Text style={styles.mainHeaderText}>Message</Text>
        </View>
        <TouchableOpacity
          onPress={() => this.setState({ isModalVisible: true })}>
          <LinearGradient
            style={styles.upgradeToPro}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={['#FBE364', '#87F484']}>
            <Text style={styles.txtUpgradetopro}>Invite Friends</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  renderMessageList = () => {
    const { CONVERSATIONS } = this.state

    return (
      <FlatList
        keyExtractor={(item, index) => `index-${index}`}
        contentContainerStyle={{ marginHorizontal: 20 }}
        data={CONVERSATIONS}
        renderItem={({ item, index }) => this.renderItem({ item, index })}
      />
    )
  }

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onLongPress={() => this._deleteUser(item)}
        style={styles.messageList} onPress={() => this._onPressMessageName(item)}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: item.FriendPicture }} style={styles.imgmassage} />
          <View style={{ paddingLeft: 15 }}>
            <Text style={styles.txtName}>{item.FriendName}</Text>
            <Text style={styles.textCaption}>{item.mostRecentMessage ? item.mostRecentMessage.Message : 'New conversation'}</Text>
          </View>
        </View>
        {item.MessageCount > 0 && <View style={{
          backgroundColor: '#87F484',
          height: 30,
          width: 30,
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text>{item.MessageCount}</Text>
        </View>}
      </TouchableOpacity>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.users.userData
  }
};

export default connect(mapStateToProps, null)(Message);
