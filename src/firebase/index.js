// Your web app's Firebase configuration
import firebaseConfig from './firebase.config.js'

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require('firebase/app')

// Add the Firebase products that you want to use
require('firebase/firestore')
// require('firebase/functions')

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)

const firestore = firebaseApp.firestore()
// ,functions = firebaseApp.functions()

export { firestore }
