const functions = require('firebase-functions'),
	admin = require('firebase-admin')

admin.initializeApp()

const firestore = admin.firestore()
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.clearUpOldSessions = functions.pubsub
	.schedule('0 */2 * * *')
	.timeZone('Europe/Warsaw')
	.onRun(context => {
		firestore
			.collection('sessions')
			.where('timestamp', '<', Date.now() - 3600000)
			.get()
			.then(snapshot => snapshot.forEach(doc => doc.ref.delete()))
		return null
	})
