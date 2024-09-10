import React, { Component } from 'react'
import { Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, ScrollView, Linking, Platform } from 'react-native'
import { Layout } from '@ui-kitten/components';

import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  type PurchaseError
} from 'react-native-iap';

import LinearGradient from 'react-native-linear-gradient';
import Header from '../Header'
//styles
import styles from './style'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { BASE_URL, FONTS, WIDTH } from '../../helper/constants';
import PRO from '../../../assets/images/PRO.png';
import Axios from 'axios';
import Promises from '../../helper/Promises';
import { connect } from 'react-redux';

const plans = ['promonthly199', 'promonthly249', 'promonthly299'];

const createHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `BasicCustom ${token}`,
});

const itemSkus = Platform.select({
  ios: [
    'promonthly199', 'promonthly249', 'promonthly299'
  ],
  android: [
    'promonthly199', 'promonthly249', 'promonthly299'
  ]
});

class Subscription extends Component {
  purchaseUpdateSubscription = null
  purchaseErrorSubscription = null

  state = {
    selected: 'SeeMee Pro',
    plansData: [
      { icon: PRO, title: '12 Months',pm: '$1.99/month' ,price: '$23.99', skipText: '5 Skips \nPer day', ibText: '5 Ice-breakers \nPer day', activated: this.props.user.SubscriptionPlan == '12 Months' },
      { icon: PRO, title: '6 Months',pm: '$2.49/month' ,price: '$14.99', skipText: '5 Skips \nPer day', ibText: '5 Ice-breakers \nPer day', activated: this.props.user.SubscriptionPlan == '6 Months' },
      { icon: PRO, title: '1 Month',pm: '$1.99' ,price: '$2.99', skipText: '5 Skips \nPer day', ibText: '5 Ice-breakers \nPer day', activated: this.props.user.SubscriptionPlan == '1 Month' },
    ],
    alreadyPro: false,
    cardLoading: '',
    isShow: false,
    currentSelectedPlan: ''
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

  componentDidMount = async () => {
    const userId = await Promises.getUsersKey();
    const token = await Promises.getUserToken();
    RNIap.initConnection().then(async () => {
      const products: RNIap.Product[] = Platform.OS === "ios" ?  await RNIap.getProducts(itemSkus) : await RNIap.getSubscriptions(itemSkus);
      console.log(products);
      RNIap.flushFailedPurchasesCachedAsPendingAndroid().catch((e) => {
        console.log(e);
      }).then(() => {
        try {
          this.purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase: SubscriptionPurchase) => {
            const receipt = purchase.transactionReceipt;
            if (receipt) {
              const obj = {
                UserId: userId,
                SubscriptionPlan: this.state.currentSelectedPlan,
                TransactionReceipt: purchase.transactionReceipt,
                productId: purchase.productId,
              }
              Axios.post(`${BASE_URL}User/UpdateUserSubscriptionPlan`, obj, {
                headers: createHeaders(token),
              }).then(async (res) => {
                if (Platform.OS === 'ios') {
                  await RNIap.finishTransactionIOS(purchase.transactionId);
                } else if (Platform.OS === 'android') {
                  // If not consumable
                  await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
                }
                await RNIap.finishTransaction(purchase);
                this.setState({ cardLoading: '' })
                if (res.data.messageType == 'success') {
                  const data = this.state.plansData
                  data[1].activated = true;
                  this.setState({ plansData: data })
                }
              }).catch(err => {
                this.setState({ cardLoading: '' })
                console.log(err)
              })
            }
          });
        } catch (error) {
          console.log(error);
          this.setState({ cardLoading: '' })
        }

        try {
          this.purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
            this.setState({ cardLoading: '' })
            console.log('purchaseErrorListener', error);
          });
        } catch (error) {
          console.log(error);
        }
      })
    })
  }

  componentWillUnmount = () => {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  }

  onBuyNowPress = (index) => {
    this.setState({ cardLoading: index, currentSelectedPlan: this.state.plansData[index].title });
    if (Platform.OS == "ios") {
      this.forIOS(index)
    } else {
      this.forAndroid(index)
    }
  }

  forIOS = async (index) => {
    try {
      await RNIap.clearTransactionIOS();
      await RNIap.requestSubscription(plans[index]);
    } catch (err) {
      console.log("BannerError >> ", err);
    }
  }

  forAndroid = async (index) => {
    try {
      await RNIap.requestSubscription(plans[index]);
    } catch (err) {
      console.log("BannerError >> ", err);
    }
  }

  handleClick = () => {
    Linking.canOpenURL('http://seemee.ca/Home/PrivacyPolicy').then(supported => {
      if (supported) {
        Linking.openURL('http://seemee.ca/Home/PrivacyPolicy');
      } else {
        console.log("Don't know how to open URI: ");
      }
    });
  };

  handleClick2 = () => {
    Linking.canOpenURL('http://seemee.ca/Home/TermsAndCondition').then(supported => {
      if (supported) {
        Linking.openURL('http://seemee.ca/Home/TermsAndCondition');
      } else {
        console.log("Don't know how to open URI: ");
      }
    });
  };


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
    return (
      <Layout style={styles.container}>
        <Header name="Subscription" />
        {this.renderCards()}
      </Layout>
    )
  }

  renderCards = () => {
    const { plansData } = this.state

    return (
      <ScrollView contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }} style={{ flex: 1 }}>
        <Text style={styles.title}>SEEMEE Pro</Text>
        <FlatList
          data={plansData}
          contentContainerStyle={{ justifyContent: 'center', marginTop: 20, paddingLeft: 15 }}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}-index`}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity activeOpacity={1} style={[styles.cardContainer, {
                backgroundColor: item.title == 'free' && '#E5E5E5',
                width: WIDTH / 2,
                zIndex: 999
              }]}>
                  <LinearGradient style={styles.cardInner} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
                    {this.renderInnerCardData(item, index)}
                  </LinearGradient>
              </TouchableOpacity>
            )
          }}
        />
        <Text style={{ color: '#999', marginTop: 12 }}>clearly and conspicuously</Text>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 12, color: '#777', textAlign: 'center' }}>
              {`By tapping continue, your payment will be charged to your iTunes account, and your subscription will automatically renew for the same package length at the same price until you cancel in settings in the iTunes store at least 24 hours prior to the end of the current period. By tapping on any plan, you agree to our Privacy Policy and Terms. you can read our Privacy Policy and Terms below. \n \n`} <Text style={{ textDecorationLine: 'underline' }} onPress={this.handleClick}>Privacy Policy</Text>
            </Text>

            <Text onPress={this.handleClick2} style={{ textDecorationLine: 'underline', fontSize: 12, color: '#777', textAlign: 'center', marginTop: 20 }}>
              Term and Conditions
             </Text>
          </View>
      </ScrollView>
    )
  }

  renderInnerCardData = (item, index) => {
    return (
      <View key={item.title} style={styles.innerContainer}>
        <View style={{ flex: 1 }}>
          <View style={styles.symbolContainer}>
            <Image source={item.icon} />
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>{item.price}</Text>
         {item.price != '$2.99' &&  <Text style={styles.price}>{item.pm}</Text>}
          <Text style={styles.subTitle}>{item.skipText}</Text>
          <Text style={styles.subTitle}>{item.ibText}</Text>
          <Text style={styles.subTitle}>Unlimited Calls</Text>
          <Text style={styles.title}>{item.price}</Text>
        </View>
        {item.activated ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AntDesign name="check" size={14} />
            <Text style={{ fontFamily: FONTS.BOOK }}>ACTIVATED</Text>
          </View>
        ) : (
            <TouchableOpacity disabled={this.state.cardLoading != ''} style={styles.btn} onPress={() => this.onBuyNowPress(index)}>
              {this.state.cardLoading === index ? <ActivityIndicator /> : (
                <View>
                  <Text style={styles.btnText}>CONTINUE</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
      </View>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.users.userData,
  }
};

export default connect(mapStateToProps)(Subscription);
