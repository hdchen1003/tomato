// 輸入 database 網址
var admin = require("firebase-admin");
var serviceAccount = require("./jsclass-179d2-firebase-adminsdk-jzds1-b98959c31b");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jsclass-179d2.firebaseio.com"
});

module.exports = admin.database();