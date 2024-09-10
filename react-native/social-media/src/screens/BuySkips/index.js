import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { Layout } from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';

import RNIap, {purchaseErrorListener,
  purchaseUpdatedListener,
  type ProductPurchase,
  type PurchaseError} from 'react-native-iap';

//styles 
import styles from './style'
import Header from '../Header'
//icon
import Fontisto from 'react-native-vector-icons/Fontisto'
import Foundation from 'react-native-vector-icons/Foundation'
import Promises from '../../helper/Promises';
import Axios from 'axios';
import { BASE_URL, createHeaders } from '../../helper/constants';

const itemSkus = Platform.select({
  ios: [
    'iceskip099'
  ],
  android: [
    'iceskip099'
  ]
});

class BuySkips extends Component {
  render() {
    return (
      this.renderMainView()
    )
  }

  state = {
    isLoading: false,
  }

  componentDidMount = async() => {
    global.page = 'buyskips'
    const userId = await Promises.getUsersKey();
    const token = await Promises.getUserToken();
    RNIap.initConnection().then(async() => {
      const products: RNIap.Product[] = await RNIap.getProducts(itemSkus);
      RNIap.flushFailedPurchasesCachedAsPendingAndroid().catch((e) => {
        console.log(e);
      }).then(() => {
        this.purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase: InAppPurchase | ProductPurchase ) => {
          const receipt = purchase.transactionReceipt;
           if (receipt) {
            const obj = {
              UserId: userId,
              SubscriptionPlan: 'buyskip',
              TransactionReceipt: purchase.transactionReceipt,
              productId: purchase.productId,
            }
            Axios.post(`${BASE_URL}User/UpdateUserSubscriptionPlan`, obj, {
              headers: createHeaders(token),
            }).then(async(res) => {
              if (Platform.OS === 'ios') {
                await RNIap.finishTransactionIOS(purchase.transactionId);
              } else if (Platform.OS === 'android') {
                // If not consumable
                await RNIap.consumePurchaseAndroid(purchase.purchaseToken);
              }
              RNIap.finishTransaction(purchase);
              this.setState({ isLoading: false })
            }).catch(err => {
              console.log(err)
              Alert.alert('Something went wrong')
              this.setState({ isLoading: false })
            })
           }
        });
 
        this.purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
          console.warn('purchaseErrorListener', error);
        });
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

  onBuyNowPress = () => {
    this.setState({ isLoading: false })
    if(Platform.OS == "ios") {
      this.forIOS()
    } else {
      this.forAndroid()
    }
  }

  forIOS = async() => {
    try {
      await RNIap.clearTransactionIOS();
      await RNIap.requestPurchase('iceskip099');
    } catch (err) {
      console.log("BannerError >> ", err);
    }
  }

  forAndroid = async() =>{
    try {
      await RNIap.requestPurchase('iceskip099');
    } catch (err) {
      console.log("BannerError >> ", err);
    }
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
      <View style={{ flex: 1 }}>
        <Layout style={styles.container}>
          <Header name="Buy Skips &" subname="Icebreakers" />
          {this.renderPurchaseCard()}
          {this.renderPurchaseBtn()}
        </Layout>
      </View>
    );
  }

  renderPurchaseCard = () => {
    return (
      <View style={styles.purchasecars}>
        <View style={{ marginTop: 30, flexDirection: 'row' }}>
          <TouchableOpacity style={styles.forwordBtn}>
            <Fontisto name="forward" size={18} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.forwordBtn, { marginLeft: 20 }]}>
            <Foundation name="mountains" size={26} />
          </TouchableOpacity>
        </View>
        <Text style={styles.txtoffer}> · 3 Skips</Text>
        <Text style={styles.txtoffer}> · 3 Icebreakers</Text>
        <Text style={styles.txtpurchseRs}>Purchase for $0.99</Text>
      </View>
    )
  }

  renderPurchaseBtn = () => {
    return (
      <TouchableOpacity disabled={this.state.isLoading} onPress={this.onBuyNowPress}>
        <LinearGradient style={styles.ringingBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
          {this.state.isLoading ? <ActivityIndicator /> :  <Text style={styles.txtpurchase}>PURCHASE</Text>}
        </LinearGradient>
      </TouchableOpacity>
    )
  }
}

export default BuySkips
