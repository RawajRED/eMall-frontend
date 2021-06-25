import React, { useState, useEffect } from 'react';

import { Provider } from 'react-redux';
import configureStore from './src/store';
import Navigation from './src/Navigation';
import { useFonts } from 'expo-font';
import { AppLoading } from 'expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeLanguage, changeFirstTime } from './src/actions/general';
import { Constants } from 'react-native-unimodules';
import { setCart } from './src/actions/cart';
import { setWishlist } from './src/actions/wishlist';
import { login, loginSeller } from './src/actions/auth';
import * as Updates from 'expo-updates';
import * as firebase from 'firebase';

const store = configureStore();
var firebaseConfig = {
  apiKey: "AIzaSyDeQJq8fsywGTSF2qfJ_P9NfVkHbJ7SFd0",
  authDomain: "e-mall-4b27a.firebaseapp.com",
  projectId: "e-mall-4b27a",
  storageBucket: "e-mall-4b27a.appspot.com",
  messagingSenderId: "208140192291",
  appId: "1:208140192291:web:f09471a2c021810ee0ff96",
  measurementId: "G-4T2SB0HYEM"
};

export default () => {
  const [fontsLoaded] = useFonts({
      'Lato': require('./assets/fonts/Lato-Regular.ttf'),
      'Lato Bold': require('./assets/fonts/Lato-Bold.ttf'),
      'Lato Thin': require('./assets/fonts/Lato-Thin.ttf'),
      'Lato Italic': require('./assets/fonts/Lato-Italic.ttf'),
      'Cairo': require('./assets/fonts/Cairo-Regular.ttf'),
      'Cairo Bold': require('./assets/fonts/Cairo-Bold.ttf'),
      'Cairo Thin': require('./assets/fonts/Cairo-Light.ttf'),
      'Cairo Italic': require('./assets/fonts/Cairo-Regular.ttf'),
  });
  const [languageLoaded, setLanguageLoaded] = useState(false);
  const [accountLoaded, setAccountLoaded] = useState(false);
  const [firstTimeLoaded, setFirstTimeLoaded] = useState(false);
  useEffect(() => {
    // AsyncStorage.removeItem('@firstTime')

    const getItems = () => {
      AsyncStorage.getItem('@language')
      .then(value => {
        store.dispatch(changeLanguage(Number(value)));
        setLanguageLoaded(true);
      })
      .catch(err => {
        setLanguageLoaded(true);
      });
  
      AsyncStorage.getItem('@token')
      .then(token => {
        token = JSON.parse(token);
        const url = token.type === 'client' ? 'client' : 'seller';
        fetch(`${Constants.manifest.extra.apiUrl}/${url}/login/token`, {headers: {token: token.token}})
        .then(resp => resp.json())
        .then(resp => {
          if(resp.status || resp === null) throw new Error('invalid token');
          if(token.type === 'client'){
            store.dispatch(setCart(resp.client.cart));
            store.dispatch(setWishlist(resp.client.wishlist));
            store.dispatch(login(resp));
          } else {
            store.dispatch(loginSeller(resp));
          }
          setAccountLoaded(true);
        })
        .catch(err => {
          setAccountLoaded(true)
        });
      })
      .catch(err => {
        setAccountLoaded(true);
      });

      AsyncStorage.getItem('@firstTime')
      .then(firstTime => {
        store.dispatch(changeFirstTime(firstTime? true : false));
        setFirstTimeLoaded(true)
      })
    }
    const init = async () => {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Updates.fetchUpdateAsync().then(() => Updates.reloadAsync());
      } else {
        getItems();
      }
    };

    if(__DEV__) getItems();
    else init();
  }, []);

  if(!(fontsLoaded && languageLoaded && accountLoaded && firstTimeLoaded))
    return <AppLoading autoHideSplash />;
  else
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
)};
