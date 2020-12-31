const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
  apiKey: "AIzaSyBLLj1uItG4wEm9dF9DzOUgYGNcM8TTo4Y",
  authDomain: "tacklebox-fishing.firebaseapp.com",
  databaseURL: "https://tacklebox-fishing.firebaseio.com",
  projectId: "tacklebox-fishing",
  storageBucket: "tacklebox-fishing.appspot.com",
  messagingSenderId: "54173765182",
  appId: "1:54173765182:web:85f6e9741eb55ca26d4b6f"
})

const mm = require('music-metadata');
const fetch = require('node-fetch');

exports.calcFishData = functions.https.onCall(async (req, res) => {
  functions.logger.log("file", req);
  let tripKey = req.key;
  functions.logger.log("key", tripKey);
  let tripData = await admin.database().ref(`sessions/${tripKey}`).once('value').then(s => s.val());
  if (tripData) {
    functions.logger.log("tripData", tripData);
    let update = {};
    let obj = {};
    let audioClips = Object.keys(tripData.audio || {});
    let photos = tripData.photos;

    for (let i = 0; i < audioClips.length; i++) {
      let metadata;
      let url = tripData.audio[audioClips[i]].url;
      let clipMetadata = await fetch(url)
        .then(res => res.buffer())
        .then(data => {
          console.log("data", data);
          return mm.parseBuffer(data, 'audio/x-m4a')
          .then(metadata => {
            console.log("inside", metadata);
            return metadata;
          });
        })
      if (clipMetadata) {
        obj[audioClips[i]] = clipMetadata;
        update['photos/' + audioClips[i] + '/duration'] = clipMetadata.duration;
      }
    }
    return obj;

    // for (let key in photos) {
    //   let photo = photos[key];

    // }
  }
  else return {error: 'Trip Data Not Found'}
  
});