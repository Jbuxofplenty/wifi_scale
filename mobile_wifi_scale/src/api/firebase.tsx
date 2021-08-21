import firebase from 'firebase/app';

// Optionally import the services that you want to use
import "firebase/auth";
import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";
import * as GoogleAuthentication from 'expo-google-app-auth';

import {Alert} from "react-native";
import Debug from '../constants/debug';
import apiKeys from '../config/keys';

let debug = "";
if(Debug.DEBUG) {
  debug = "/development/";
}

const emptyAddress = {
  "address1": "",
  "address2": "",
  "city": "",
  "state": "",
  "zip": "",
};

export const fire = firebase;

export async function googleSignIn() {
  return GoogleAuthentication.logInAsync({
    // Use client ID's of google cloud api keys for ios and android (auto-generated when a new app is added to firebase)
    // host.exp.exponent must be specified as bundle ID in API key when using expo go
    androidClientId: apiKeys.androidGoogleSignInWebClientId,
    iosClientId: apiKeys.iosGoogleSignInWebClientId,
    androidStandaloneAppClientId: apiKeys.androidGoogleSignInWebClientId,
    iosStandaloneAppClientId: apiKeys.iosGoogleSignInWebClientId,
    scopes: ['profile', 'email']
  })
  .then((logInResult) => {
    if (logInResult.type === 'success') {
      const { idToken, accessToken } = logInResult;
      const credential = firebase.auth.GoogleAuthProvider.credential(
        idToken,
        accessToken
      );

      return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(async () => {
        return firebase.auth().signInWithCredential(credential);
      });
    }
    return Promise.reject();
  })
  .catch((error) => {
    console.log(error.message);
    return Promise.reject();
  });
}

export async function updateUser(user) {
  var userId = firebase.auth().currentUser.uid;
  // Set the user data
  return firebase.database().ref(debug + '/users/' + userId).update(user).catch(function(error) {
    console.log(error.message);
    Promise.reject();
  });
}

export async function retrieveUser() {
  var userId = firebase.auth().currentUser.uid;
  // Get the user data
  var snapshot = await firebase.database().ref(debug + '/users/' + userId).once('value')
    .catch(function(error) {
      console.log(error.message);
      Promise.reject();
    });
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return false; 
}

export async function retrieveProducts() {
  var snapshot = await firebase.database().ref(debug + '/products').once('value')
    .catch(function(error) {
      console.log(error.message);
      Promise.reject();
    });
  
  if (snapshot.exists()) {
    return snapshot.val().filter(x => x !== undefined);;
  }
  return false; 
}

export async function registerUser(username, email, password) {
  try {
    // Add user to database
    return firebase.auth().createUserWithEmailAndPassword(email, password).then((authData) => {
      return firebase.database().ref(debug + "/users/" + authData.user.uid).set({
        email: email,
        username: username,
        phone: "",
        address: emptyAddress,
        formattedAddress: "",
        headshot: "",
      });
     }).catch(function(error) {
        console.log("Error!", error.message);
        return Promise.reject();
    });
  } catch (error) {
    console.log("Error!", error.message);
    return Promise.reject();
  }
}

export async function signIn(email, password) {
  try {
    return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(async () => {
      return firebase.auth().signInWithEmailAndPassword(email.trim(), password.trim());
    })
  } catch (error) {
    return console.log("Error!", error.message);
  }
}

export async function signOut() {
  await firebase.auth().signOut();
}

export async function isLoggedIn() {
  try {
    await new Promise((resolve, reject) =>
      firebase.auth().onAuthStateChanged(
        user => {
          if (user) {
            // User is signed in.
            resolve(user)
          } else {
            // No user is signed in.
            reject('no user logged in')
          }
        },
        // Prevent console error
        error => reject(error)
      )
    )
    return true
  } catch (error) {
    return false
  }
}

export function getUser() {
  var user = firebase.auth().currentUser;
  return user;
}