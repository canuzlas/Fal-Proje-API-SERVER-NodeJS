const firebase = require('firebase-admin')
var serviceAccount = require("../config/falhub-6c7a2-firebase-adminsdk-kuv1f-fdf4c6c8de.json");
const firebaseConfig = {
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://falhub-6c7a2-default-rtdb.europe-west1.firebasedatabase.app",
};

firebase.initializeApp(firebaseConfig);

const fbdatabase = firebase.database()

module.exports = fbdatabase 
