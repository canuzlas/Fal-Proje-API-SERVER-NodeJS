const firebase = require('firebase-admin')
var serviceAccount = require("../config/sdk.json");
const firebaseConfig = {
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "*****",
};

firebase.initializeApp(firebaseConfig);

const fbdatabase = firebase.database()

module.exports = fbdatabase 
