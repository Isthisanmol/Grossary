import {useState, useContext} from 'react';
import auth from '@react-native-firebase/auth';
import {Button, Title, useTheme} from 'react-native-paper';
import {StyleSheet, Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {NotificationsContext} from '../contexts/notifications';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

const LoginPage = () => {
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [state, dispatch] = useContext(NotificationsContext);

  const switchToLogin = () => setIsSignupVisible(false);
  const switchToSignup = () => setIsSignupVisible(true);

  const theme = useTheme();

  const loginUser = async ({email, password}) => {
    if (!email || !password) {
      return;
    }

    try {
      setLoaderVisible(true);
      let response = await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      setLoaderVisible(false);

      dispatch({
        type: 'add-notification',
        payload: {
          severity: 'error',
          title: 'Login error',
          description: error.message,
        },
      });
    }
  };

  const signupUser = async ({email, password, name}) => {
    try {
      setLoaderVisible(true);
      const response = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      setLoaderVisible(false);

      await firestore().collection('users').doc(response.user.uid).set({
        name,
        itemList: [],
      });
      dispatch({
        type: 'add-notification',
        payload: {
          severity: 'success',
          title: 'User created successfully',
        },
      });
    } catch (error) {
      dispatch({
        type: 'add-notification',
        payload: {
          severity: 'error',
          title: 'Sign up error',
          description: error.message,
        },
      });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      {!isSignupVisible ? (
        <LoginForm
          switchForm={switchToSignup}
          onLogin={loginUser}
          loaderVisible={loaderVisible}
        />
      ) : (
        <SignUpForm
          switchForm={switchToLogin}
          onSignup={signupUser}
          loaderVisible={loaderVisible}
        />
      )}
    </View>
  );
};

export default LoginPage;
