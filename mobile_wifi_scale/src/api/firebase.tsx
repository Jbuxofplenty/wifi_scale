import firebase from 'firebase/app';

// Optionally import the services that you want to use
import "firebase/auth";
import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";

import {Alert} from "react-native";
import Debug from '../constants/debug';

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

export async function registerUser(email, password, username) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const currentUser = firebase.auth().currentUser;

    const db = firebase.database();
    // Add user to database
    firebase.auth().createUserWithEmailAndPassword(email, password).then((authData) => {
      firebase.database().ref(debug + "/users/" + authData.user.uid).set({
        email: email,
        username: username,
        phone: "",
        address: emptyAddress,
        formattedAddress: "",
        headshot: "https://s3.amazonaws.com/dejafood.com/mobile_assets/deja_gradient.png",
      });
      signIn(email, password);
     }).catch(function(error) {
      Alert.alert("There is something wrong!", error.message);
    });
  } catch (err) {
    Alert.alert("There is something wrong!", err.message);
  }
}

export async function signIn(email, password) {
  try {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(async () => {
      return firebase.auth().signInWithEmailAndPassword(email, password);
    })
    return firebase.auth().currentUser;
  } catch (err) {
    Alert.alert("There is something wrong!", err.message);
  }
}

export async function loggingOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    Alert.alert('There is something wrong!', err.message);
  }
}

export async function signOut() {
  firebase.auth().signOut();
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