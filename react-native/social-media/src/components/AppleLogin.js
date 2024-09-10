import React from 'react';
import { StyleSheet} from 'react-native';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';


export default class AppleLogin extends React.Component {
  constructor() {
    super();
    this.authCredentialListener = null;
    this.user = null;
    this.state = {
      credentialStateForUser: -1,
    }
  }
  componentDidMount() {
    /**
     * subscribe to credential updates.This returns a function which can be used to remove the event listener
     * when the component unmounts.
     */
    this.authCredentialListener = appleAuth.onCredentialRevoked(async () => {
      console.warn('Credential Revoked');
      this.fetchAndUpdateCredentialState().catch(error =>
        this.setState({ credentialStateForUser: `Error: ${error.code}` }),
      );
    });

    this.fetchAndUpdateCredentialState()
      .then(res => this.setState({ credentialStateForUser: res }))
      .catch(error => this.setState({ credentialStateForUser: `Error: ${error.code}` }))
  }

  componentWillUnmount() {
    /**
     * cleans up event listener
     */
    this.authCredentialListener();
  }

  signIn = async () => {
    console.warn('Beginning Apple Authentication');

    // start a login request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [
          appleAuth.Scope.EMAIL,
          appleAuth.Scope.FULL_NAME,
        ],
      });

      console.log('appleAuthRequestResponse', appleAuthRequestResponse);

      const {
        user: newUser,
        email,
        fullName,
        nonce,
        identityToken,
        realUserStatus,
        authorizationCode /* etc */,
      } = appleAuthRequestResponse;

      this.user = newUser;

      const obj = {
        email:email,
        id: appleAuthRequestResponse.user,
        name: fullName
      }
      this.props.signupAPIFB(obj);

      this.fetchAndUpdateCredentialState()
        .then(res => this.setState({ credentialStateForUser: res }))
        .catch(error =>
          this.setState({ credentialStateForUser: `Error: ${error.code}` }),
        );

      if (identityToken) {
        // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
      } else {
        // no token - failed sign-in?
      }

      if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
        console.log("I'm a real person!");
      }

      console.warn(`Apple Authentication Completed, ${this.user}, ${email}`);
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.error(error);
      }
    }
  };

  fetchAndUpdateCredentialState = async () => {
    if (this.user === null) {
      this.setState({ credentialStateForUser: 'N/A' });
    } else {
      const credentialState = await appleAuth.getCredentialStateForUser(this.user);
      if (credentialState === appleAuth.State.AUTHORIZED) {
        this.setState({ credentialStateForUser: 'AUTHORIZED' });
      } else {
        this.setState({ credentialStateForUser: credentialState });
      }
    }
  }

  render() {
    return (
      <AppleButton
        style={styles.appleButton}
        cornerRadius={5}
        buttonStyle={AppleButton.Style.BLACK}
        buttonType={AppleButton.Type.SIGN_IN}
        onPress={() => this.signIn()}
      />
    )
  }
}

const styles = StyleSheet.create({
  appleButton: {
    width: '100%',
    height: 45,
    marginTop: 20
  },
});