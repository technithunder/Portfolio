import AsyncStorage from '@react-native-community/async-storage';

export default class Promises {
  //USER TOKEN & ID
  static async setUserToken(val) {
    await AsyncStorage.setItem('seemee_token', val);
  }

  static async setUsersKey(val) {
    await AsyncStorage.setItem('seemee_user_key', JSON.stringify(val));
  }

  static async getUserToken() {
    const value = await AsyncStorage.getItem('seemee_token');
    return value;
  }

  static async getUsersKey() {
    const value = await AsyncStorage.getItem('seemee_user_key');
    return JSON.parse(value);
  }

  static async removeEverything() {
    await AsyncStorage.removeItem('seemee_token');
    await AsyncStorage.removeItem('seemee_user_key');
  }

}
