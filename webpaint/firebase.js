const firebaseConfig = {
  apiKey: "AIzaSyC4bhvgrZnBlZa63HOjr4YWb0vPUEy0TNs",
  authDomain: "bnoty-ae856.firebaseapp.com",
  databaseURL: "https://bnoty-ae856-default-rtdb.firebaseio.com",
  projectId: "bnoty-ae856",
  storageBucket: "bnoty-ae856.appspot.com",
  messagingSenderId: "109988155599",
  appId: "1:109988155599:web:24fc23b8766d44363a27ba",
  measurementId: "G-J5849SYJY8"
};    

firebase.initializeApp(firebaseConfig);
console.log(firebase);

chrome.identity.getProfileUserInfo({'accountStatus': 'ANY'}, function(info) {
  email = info.email;
  console.log(info);
})

const db = firebase.firestore();
db.collection('restaurants').get().then((response)=>{
  response.forEach((doc)=>{
    console.log(doc.data())
  })
})

chrome.runtime.onMessage.addListener((msg, sender, response) => {

  if(msg.command == 'testNote'){
    console.log("testNote");
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      let url = tabs[0].url;
      console.log(url);
    }); 
  }

  return true;
});
