import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Layout, Select, SelectItem } from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';
import RangeSlider from '../../components/RangeSlider';
import ImagePicker from 'react-native-image-crop-picker';

//styles
import styles from './style';
import Gender from '../../../assets/images/gender.png';
import Dp from '../../../assets/images/dp.jpg';
import Edit from '../../../assets/images/edit.png';
import OptionModal from '../optionmodal';
import { BASE_URL, FONTS, HEIGHT, reset } from '../../helper/constants';
import WarningModal from '../../components/Modal';
import Promises from '../../helper/Promises';
import Axios from 'axios';
import { connect } from 'react-redux';
import { fetchUserDataById } from '../../redux/actions';

const createHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `BasicCustom ${token}`,
});

class Profile extends Component {
  state = {
    //gender
    gender: 'Male',
    genderIndex: 0,
    genderData: [{ text: 'Male' }, { text: 'Female' }, { text: 'LGBTQ' }],

    //intrestedIn
    intrestedIn: 'Male',
    intrestedIndex: 0,
    intrestedInData: [{ text: 'Any'}, { text: 'Male' }, { text: 'Female' }, { text: 'LGBTQ' }],

    //looking for
    lookingForIndex: 0,
    lookingFor: 'Relationship',
    lookingForData: [
      { text: 'Relationship' },
      { text: 'Friendship' },
    ],

    visible: false,
    avtarImage: '',
    fname: '',
    lname: '',
    minAge: 18,
    maxAge: 28,
    distance: [50],
    baseImage: '',
    Modaltext: '',
    isModalVisible: false,
    userData: '',
    loading: false,
    age: ''
  };

  render() {
    return this.renderMainView();
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
    this.setState({ loading: true }, () => {
      this.props.fetchUserDataById()
    })
  };

  componentDidUpdate(prevProps, prevState) {
    const { FirstName, LastName, Gender, IntrestedIn, LookingFor, MinAge, MaxAge, Distance, Age, FilePath } = this.props.user

    if (this.props.user !== prevProps.user) {
      this.setState({
        userData: this.props.user,
        fname: FirstName,
        lname: LastName,
        loading: false,
        gender: Gender,
        intrestedIn: IntrestedIn,
        lookingFor: LookingFor,
        minAge: MinAge,
        maxAge: MaxAge,
        distance: [Distance],
        age: Age,
        avtarImage: `${FilePath}?${new Date().getTime()}`
      });
    }
  }

  onSavePress = async () => {
    const {
      fname,
      lname,
      gender,
      intrestedIn,
      lookingFor,
      baseImage,
      minAge,
      maxAge,
      distance,
      age
    } = this.state;
    this.setState({ loading: true });
    const userId = await Promises.getUsersKey();
    const token = await Promises.getUserToken();
    if (fname === null) {
      this.setState({ Modaltext: 'Firstname is empty', isModalVisible: true })
    } else if (lname === null) {
      this.setState({ Modaltext: 'LastName is empty', isModalVisible: true })
    } else {
      const obj = {
        UserId: userId,
        FirstName: fname,
        LastName: lname,
        Gender: gender,
        IntrestedIn: intrestedIn,
        LookingFor: lookingFor,
        Image: baseImage,
        MinAge: minAge,
        MaxAge: maxAge,
        Age: age,
        Distance: distance[0],
      };
      Axios.post(`${BASE_URL}User/UpdateProfile`, obj, {
        headers: createHeaders(token),
      })
        .then((res) => {
          this.setState({ loading: false });
          if (res.data.messageType === 'success') {
            this.props.fetchUserDataById()
            Alert.alert('Record updated successfully')
          } else {
            this.setState({ Modaltext: 'something went wrong', isModalVisible: true })
          }
        })
        .catch((e) => {
          this.setState({ loading: false });
          console.log(e);
        });
    }
  };

  logout = async () => {
    await Promises.removeEverything();
    reset(this.props, 'Login')
  }

  setDropDownValue = (field, val) => {
    switch (field) {
      case 'gender':
        this.setState(
          {
            gender: this.state.genderData[val.row].text,
            genderIndex: parseInt(val.row),
          },
          () => {
            console.log(this.state.gender, this.state.genderIndex);
          },
        );
        break;
      case 'intrestedIn':
        this.setState(
          {
            intrestedIn: this.state.intrestedInData[val.row].text,
            intrestedIndex: parseInt(val.row),
          },
          () => {
            console.log(this.state.intrestedIn, this.state.intrestedIndex);
          },
        );
        break;
      case 'lookingFor':
        this.setState(
          {
            lookingFor: this.state.lookingForData[val.row].text,
            lookingForIndex: parseInt(val.row),
          },
          () => {
            console.log(this.state.lookingFor, this.state.genderIndex);
          },
        );
        break;
      default:
        break;
    }
  };

  modelClose = () => {
    this.setState({ visible: !this.state.visible });
  };

  openCamera = () => {
    ImagePicker.openCamera({
      width: 150,
      height: 150,
      cropping: true,
      includeBase64: true,
    }).then((image) => {
      this.setState({
        avtarImage: `data:${image.mime};base64,${image.data}`,
        baseImage: image.data,
      });
      this.modelClose();
    });
  };

  openGallery = () => {
    ImagePicker.openPicker({
      width: 150,
      height: 150,
      cropping: true,
      includeBase64: true,
    }).then((image) => {
      this.setState({
        avtarImage: `data:${image.mime};base64,${image.data}`,
        baseImage: image.data,
      });
      this.modelClose();
    });
  };

  changeRange = (rangeValue) => {
    this.setState({ minAge: rangeValue[0], maxAge: rangeValue[1] });
  };

  changeDistance = (distance) => {
    this.setState({ distance });
  };

  closeModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible })
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
    const { visible, Modaltext, isModalVisible } = this.state;
    return (
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
        <Layout style={styles.container}>
          {this.renderHeader()}
          {this.renderProfile()}
          {this.renderDropdown()}
          <OptionModal
            visible={visible}
            modelClose={this.modelClose}
            openCamera={this.openCamera}
            openGallery={this.openGallery}
          />
          <WarningModal
            Modaltext={Modaltext}
            isModalVisible={isModalVisible}
            closeModal={this.closeModal}
          />
        </Layout>
      </ScrollView>
    );
  };

  renderHeader = () => {
    return (
      <View style={styles.headerMain}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.headerBorder} />
          <Text style={styles.mainHeaderText}>Profile</Text>
        </View>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Subscription')}>
          <LinearGradient
            style={styles.upgradeToPro}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={['#FBE364', '#87F484']}>
            <Text style={styles.txtUpgradetopro}>Upgrade to PRO</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  renderProfile = () => {
    const { userData, loading, age, avtarImage } = this.state

    return (
      <View style={{ alignItems: 'center', marginTop: 50 }}>
        <View style={styles.imagePicker}>
          <TouchableOpacity style={styles.edit} onPress={this.modelClose}>
            <Image source={Edit} />
          </TouchableOpacity>
          <Image source={{ uri: avtarImage && avtarImage }} style={styles.dp} />
        </View>
        {loading ? <ActivityIndicator color="#000" style={{ marginTop: 20 }} /> : (
          <View>
            <Text style={styles.textProfilename}>{userData.FirstName}</Text>
            <Text style={styles.country}>{userData.LastName}</Text>
            <Text style={styles.ageyears}>{age} years</Text>
          </View>
        )}
      </View>
    );
  };

  renderDropdown = () => {
    const { lookingFor } = this.state

    return (
      <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 50, paddingBottom: HEIGHT / 4 }}>
        {this.renderTextInputs({
          title: 'Name',
          value: this.state.fname,
          setValue: (val) => this.setState({ fname: val }),
        })}
        {this.renderTextInputs({
          title: 'Country',
          value: this.state.lname,
          setValue: (val) => this.setState({ lname: val }),
        })}
        {this.renderDropdownSection({
          title: 'Your gender',
          value: this.state.gender,
          index: this.state.genderIndex,
          data: this.state.genderData,
          setValue: (val) => this.setDropDownValue('gender', val),
        })}
        {this.renderDropdownSection({
          title: 'Interested in',
          value: this.state.intrestedIn,
          index: this.state.intrestedIndex,
          data: this.state.intrestedInData,
          setValue: (val) => this.setDropDownValue('intrestedIn', val),
        })}
        {/* {this.renderDropdownSection({
          title: 'Looking for',
          value: this.state.lookingFor,
          index: this.state.lookingForIndex,
          data: this.state.lookingForData,
          setValue: (val) => this.setDropDownValue('lookingFor', val),
        })} */}
        {this.renderRangeSlider()}
        <TouchableOpacity onPress={this.onSavePress}>
          <LinearGradient
            style={styles.btn}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
            colors={['#FBE364', '#87F484']}>
            <Text style={styles.btnText}>save changes</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={this.logout}>
          <Text style={styles.btnText}>logout</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderRangeSlider = () => {
    const { distance, lookingFor } = this.state

    return (
      <View>
        {lookingFor != 'Friendship' &&
          <View style={{ marginTop: 15 }}>
            <Text style={styles.sliderLabel}>Age range (years)</Text>
            <RangeSlider {...this.state} changeRangeValue={this.changeRange} />
          </View>
        }
        {/* <View style={{ marginTop: 35 }}>
          <Text style={styles.sliderLabel}>Distance range (kms)</Text>
          <Slider distance={distance} {...this.state} changeDistance={this.changeDistance} />
        </View> */}
      </View>
    );
  };

  //inputs
  renderTextInputs = (params) => {
    return (
      <View style={styles.inputContainer}>
        <Text style={[styles.descText, { flex: 1, textAlign: 'left' }]}>
          {params.title}
        </Text>
        <TextInput
          style={[
            styles.dropdown,
            {
              backgroundColor: '#fff',
              paddingHorizontal: 20,
              paddingVertical: 15,
              fontFamily: FONTS.BOOK
            },
          ]}
          placeholder={`Enter ${params.title}`}
          value={params.value}
          onChangeText={(val) => params.setValue(val)}
        />
      </View>
    );
  };

  // drpodown selection start
  renderDropdownSection = (params) => {
    return (
      <View style={styles.dropdownSection}>
        <Text style={[styles.descText, { flex: 1, textAlign: 'left' }]}>
          {params.title}
        </Text>
        <Select
          size="large"
          value={(props) => (
            <Text {...props} style={[props.style, styles.dropdownText]}>
              {params.value}
            </Text>
          )}
          style={styles.dropdown}
          onSelect={(index) => params.setValue(index)}>
          {params.data.map((ele, index) => {
            return (
              <SelectItem
                style={styles.descText, { backgroundColor: ele.text == 'Any' ? '#99f19e' : 'white'}}
                key={`${index}`}
                title={ele.text}
              />
            );
          })}
        </Select>
      </View>
    );
  };

  renderImage = () => (
    <View>
      <Image
        source={Gender}
        style={{ height: 20, width: 20, resizeMode: 'contain' }}
      />
    </View>
  );
  //dropdown selection end
}

const mapStateToProps = (state) => {
  return {
    user: state.users.userData
  }
};

export default connect(mapStateToProps, {fetchUserDataById})(Profile);
