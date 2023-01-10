import {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator, Appearance} from 'react-native';
import auth from '@react-native-firebase/auth';
import LoginPage from './src/components/LoginPage';
import {lightTheme, darkTheme} from './constants.js';
import Notifications from './src/components/common/Notifications';
import {NotificationsProvider} from './src/contexts/notifications';
import {enGB, en, registerTranslation} from 'react-native-paper-dates';
import {FAB, Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import HomePage from './src/components/HomePage';
registerTranslation('en-GB', enGB);
registerTranslation('en', en);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState();
  const [loaderVisible, setLoaderVisible] = useState(true);

  const onAuthStateChanged = user => {
    setUser(user);
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setLoaderVisible(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const scheme = Appearance.getColorScheme();

  if (loaderVisible) {
    return (
      <NotificationsProvider>
        <PaperProvider theme={scheme === 'dark' ? darkTheme : lightTheme}>
          <ActivityIndicator size="large" />
          <Notifications />
        </PaperProvider>
      </NotificationsProvider>
    );
  }

  if (isLoggedIn) {
    return (
      <NotificationsProvider>
        <PaperProvider theme={scheme === 'dark' ? darkTheme : lightTheme}>
          <HomePage />
          <Notifications />
        </PaperProvider>
      </NotificationsProvider>
    );
  }

  if (!isLoggedIn) {
    return (
      <NotificationsProvider>
        <PaperProvider theme={scheme === 'dark' ? darkTheme : lightTheme}>
          <LoginPage />
          <Notifications />
        </PaperProvider>
      </NotificationsProvider>
    );
  }
};

export default App;
