/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RangeSlider from '../../components/RangeSlider';
import Header from '../Header';
import ImagePicker from 'react-native-image-crop-picker';

//styles
import styles from './styles';
import { Layout, Select, SelectItem } from '@ui-kitten/components';
import GallaryImage from '../../../assets/images/image.png';
import Gender from '../../../assets/images/gender.png';
import Call from '../../../assets/images/call.png';
import OptionModal from '../optionmodal';
import Axios from 'axios';
import Promises from '../../helper/Promises';
import { BASE_URL } from '../../helper/constants';
import WarningModal from '../../components/Modal';
import { TextInputMask } from 'react-native-masked-text';
import moment from 'moment';

const createHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `BasicCustom ${token}`,
});

class Index extends Component {
  constructor(props) {
    super(props)
    this.dateInput = React.createRef()
  }

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
    age: '',
    baseImage: '',
    minAge: 18,
    maxAge: 28,
    distance: [50],
    loading: false,
    Modaltext: '',
    isModalVisible: false,
    AgeYears: ''
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
    global.page = 'setprofile'
    this.fetchUserData();
  };

  fetchUserData = async () => {
    const userId = await Promises.getUsersKey();
    const token = await Promises.getUserToken();
    Axios.get(`${BASE_URL}User/GetById?userId=${userId}`, {
      headers: createHeaders(token),
    })
      .then((res) => {
        const { data } = res.data;
        const { FirstName } = data;
        this.setState({ fname: FirstName});
      })
      .catch((e) => {
        console.log(e);
      });
  };

  changeDistance = (distance) => {
    this.setState({ distance });
  };

  changeRange = (rangeValue) => {
    this.setState({ minAge: rangeValue[0], maxAge: rangeValue[1] });
  };

  setProfile = async () => {
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
      AgeYears
    } = this.state;
    const userId = await Promises.getUsersKey();
    const token = await Promises.getUserToken();
    if (fname === null) {
      this.setState({ Modaltext: 'Firstname is empty', isModalVisible: true })
    } else if (lname === null) {
      this.setState({ Modaltext: 'Country is empty', isModalVisible: true })
    } else if (isNaN(AgeYears))  {
      this.setState({ Modaltext: 'Birthdate is invalid', isModalVisible: true })
    } else if (AgeYears < 18) {
      this.setState({ Modaltext: 'Your age is not enough to be a part of SEEMEE', isModalVisible: true })
    } else {
      this.setState({ loading: true });
      const obj = {
        UserId: userId,
        FirstName: fname,
        LastName: lname,
        Gender: gender,
        IntrestedIn: intrestedIn,
        MinAge: minAge,
        MaxAge: maxAge,
        Image: baseImage,
        Age: AgeYears
      };
      // if (lookingFor !== 'Friendship') {
      //   obj['MinAge'] = minAge;
      //   obj['MaxAge'] = maxAge;
      // }
      Axios.post(`${BASE_URL}User/UpdateProfile`, obj, {
        headers: createHeaders(token),
      })
        .then(async (res) => {
          console.log(res, 'setProfile data')
          this.setState({ loading: false });
          if (res.data.messageType === 'success') {
            this.props.navigation.navigate('BottomBar', { from: 'setupProfile'});
          } else {
            this.setState({ Modaltext: 'something went wrong', isModalVisible: true, loading: false })
          }
        })
        .catch((e) => {
          this.setState({ loading: false });
          console.log(e);
        });
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
        avtarImage: { uri: `data:${image.mime};base64,${image.data}` },
        baseImage: image.data,
      });
      this.modelClose();
    });
  };

  openGallery = () => {
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      cropping: true,
      includeBase64: true,
    }).then((image) => {
      this.setState({
        avtarImage: { uri: `data:${image.mime};base64,${image.data}` },
        baseImage: image.data,
      });
      this.modelClose();
    });
  };

  setDropDownValue = (field, val) => {
    switch (field) {
      case 'gender':
        this.setState(
          {
            gender: this.state.genderData[val.row].text,
            genderIndex: parseInt(val.row),
          },
        );
        break;
      case 'intrestedIn':
        this.setState(
          {
            intrestedIn: this.state.intrestedInData[val.row].text,
            intrestedIndex: parseInt(val.row),
          },
        );
        break;
      // case 'lookingFor':
      //   console.log(val.row)
      //   this.setState(
      //     {
      //       lookingFor: this.state.lookingForData[val.row].text,
      //       lookingForIndex: parseInt(val.row),
      //     },
      //     () => {
      //       console.log(this.state.lookingFor, this.state.lookingForIndex);
      //     },
      //   );
       // break;
      default:
        break;
    }
  };

  closeModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible })
  }

  onBlurDateInput = () => {
    let currentYear = moment(new Date(), 'MM/DD/YYYY').year()
    let bdateYear = moment(this.dateInput.current.props.value, 'MM/DD/YYYY').year()
    let age = currentYear - bdateYear
    this.setState({ AgeYears: age })
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
    const { visible, avtarImage, Modaltext, isModalVisible } = this.state;
    return (
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
        <Layout style={styles.container}>
          <Header name="Setup" subname="Your profile" />
          <TouchableOpacity onPress={this.modelClose}>
            <LinearGradient
              style={styles.imagePicker}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={['#FBE364', '#87F484']}>
              {this.state.avtarImage === '' ? (
                <Image source={GallaryImage} style={styles.img} />
              ) : (
                  <Image
                    source={avtarImage}
                    style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
                  />
                )}
            </LinearGradient>
          </TouchableOpacity>
          <Text style={[styles.descText, { marginTop: 10 }]}>
            Upload your profile picture
          </Text>
          <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 50 }}>
            {this.renderTextInputs({
              title: 'Birth Date',
              value: this.state.age,
              setValue: (val) => this.setState({ age: val }),
              type: 'date'
            })}
            {this.renderTextInputs({
              title: 'Name',
              value: this.state.fname,
              setValue: (val) => this.setState({ fname: val }),
              type: 'input'
            })}
            {this.renderTextInputs({
              title: 'Country',
              value: this.state.lname,
              setValue: (val) => this.setState({ lname: val }),
              type: 'input'
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
            {this.renderRingigngBtn()}
          </View>
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

  //inputs
  renderTextInputs = (params) => {
    return (
      <View style={styles.inputContainer}>
        <Text style={[styles.descText, { flex: 1, textAlign: 'left' }]}>
          {params.title}
        </Text>
        {params.type === 'date' ? (
          <TextInputMask
            onBlur={this.onBlurDateInput}
            style={[styles.dropdown, styles.inputs]}
            ref={this.dateInput}
            value={params.value}
            type={'datetime'}
            options={{
              format: 'MM/DD/YYYY'
            }}
            placeholder={'MM/DD/YYYY'}
            onChangeText={(val) => this.setState({ age: val })}
          />
        ) : (
            <TextInput
              style={[styles.dropdown, styles.inputs]}
              placeholder={`Enter ${params.title}`}
              value={params.value}
              onChangeText={(val) => params.setValue(val)}
            />
          )}
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
                style={styles.descText}
                key={`${index}`}
                title={(props) => (
                  <Text style={[props.style, styles.dropdownText, { backgroundColor: ele.text == 'Any' ? '#99f19e' : 'white'}]}>
                    {ele.text}
                  </Text>
                )}
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

  renderRangeSlider = () => {
    const { distance, lookingFor } = this.state;
    return (
      <View>
        {lookingFor !== 'Friendship' && (
          <View style={{ marginTop: 15 }}>
            <Text style={styles.sliderLabel}>Age range (years)</Text>
            <RangeSlider {...this.state} changeRangeValue={this.changeRange} />
          </View>
        )}
        {/* <View style={{ marginTop: 35, marginBottom: 30 }}>
          <Text style={styles.sliderLabel}>Distance range (kms)</Text>
          <Slider distance={distance} {...this.state} changeDistance={this.changeDistance} />
        </View> */}
      </View>
    );
  };

  renderRingigngBtn = () => {
    const { loading } = this.state;
    return (
      <TouchableOpacity onPress={this.setProfile} style={{ marginBottom: 70 }}>
        <LinearGradient
          style={styles.ringingBtn}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={['#FBE364', '#87F484']}>
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={Call} style={styles.callimg} />
                <Text style={styles.txtRinging}>Continue</Text>
              </View>
            )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };
}

export default Index;
