const firebaseConfig = {
	apiKey: process.env.VUE_APP_FIREBASE_KEY,
	authDomain: 'kdc-dice-game.firebaseapp.com',
	databaseURL: 'https://kdc-dice-game.firebaseio.com',
	projectId: 'kdc-dice-game',
	storageBucket: 'kdc-dice-game.appspot.com',
	messagingSenderId: '1074827578569',
	appId: process.env.VUE_APP_FIREBASE_ID,
	measurementId: 'G-H9N3RRY7NC',
}

export default firebaseConfig
